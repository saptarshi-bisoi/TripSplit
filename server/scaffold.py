import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())

# server.js
server_js = """
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Setup
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('[TripSplit] MongoDB Connected Successfully');
    app.listen(PORT, () => console.log(`[TripSplit] API Running on Port ${PORT}`));
}).catch(err => {
    console.error('Database connection critical error:', err);
});
"""
write_file('server.js', server_js)

# .env
env_file = """
PORT=5000
# IMPORTANT: Replace the MONGO_URI with your MongoDB Atlas connection string
MONGO_URI=mongodb+srv://sapta:sapta123@cluster0.mongodb.net/tripsplit?retryWrites=true&w=majority
JWT_SECRET=tripsplit_super_secret_key_2026
"""
write_file('.env', env_file)

# models/User.js
user_model = """
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
"""
write_file('models/User.js', user_model)

# models/Trip.js
trip_model = """
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  payer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  shares: {
    type: Map,
    of: Number,
    required: true
  }
});

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expenses: [expenseSchema]
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
"""
write_file('models/Trip.js', trip_model)

# routes/auth.js
auth_route = """
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'tripsplit_secret_key', 
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
"""
write_file('routes/auth.js', auth_route)

# controllers/tripController.js
trip_controller = """
const Trip = require('../models/Trip');

function calculateSettlements(members, expenses) {
  const balances = {};
  
  members.forEach(m => balances[m.toString()] = 0);

  expenses.forEach(expense => {
    balances[expense.payer.toString()] += expense.amount;
    for (const [userId, share] of expense.shares.entries()) {
      balances[userId] -= share;
    }
  });

  const creditors = [];
  const debtors = [];
  
  for (const [person, balance] of Object.entries(balances)) {
    if (balance > 0.01) creditors.push({ person, amount: balance });
    else if (balance < -0.01) debtors.push({ person, amount: Math.abs(balance) });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let c = 0, d = 0;

  while (c < creditors.length && d < debtors.length) {
    const creditor = creditors[c];
    const debtor = debtors[d];

    const settleAmount = Math.min(creditor.amount, debtor.amount);
    
    if (settleAmount > 0.01) {
      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount: parseFloat(settleAmount.toFixed(2))
      });
    }

    creditor.amount -= settleAmount;
    debtor.amount -= settleAmount;

    if (creditor.amount < 0.01) c++;
    if (debtor.amount < 0.01) d++;
  }

  return settlements;
}

exports.getTripDetails = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate('members', 'name email')
      .populate('expenses.payer', 'name');
      
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const memberIds = trip.members.map(m => m._id.toString());
    const settlements = calculateSettlements(memberIds, trip.expenses);

    const memberMap = {};
    trip.members.forEach(m => memberMap[m._id.toString()] = m.name);
    
    const readableSettlements = settlements.map(s => ({
      from: memberMap[s.from],
      to: memberMap[s.to],
      amount: s.amount
    }));

    res.status(200).json({ trip, settlements: readableSettlements });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trip' });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const { name, members } = req.body; 
    const tripMembers = [...new Set([req.user.userId, ...members])];

    const newTrip = new Trip({
      name,
      owner: req.user.userId,
      members: tripMembers,
      expenses: []
    });

    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(500).json({ message: 'Error creating trip', error: err.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { description, amount, payer, shares } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (!trip.members.includes(payer)) {
        return res.status(400).json({ message: 'Payer must be a trip member' });
    }

    const expense = { description, amount, payer, shares };
    trip.expenses.push(expense);
    await trip.save();

    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Error adding expense', error: err.message });
  }
};
"""
write_file('controllers/tripController.js', trip_controller)

# middleware/auth.js
auth_middleware = """
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tripsplit_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
"""
write_file('middleware/auth.js', auth_middleware)

# routes/trips.js
trips_route = """
const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');

// Apply auth middleware to all trip routes
router.use(auth);

// Get all trips for logged in user
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ members: req.user.userId }).populate('members', 'name');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Trip specific logic
router.post('/', tripController.createTrip);
router.get('/:tripId', tripController.getTripDetails);
router.post('/:tripId/expenses', tripController.addExpense);

module.exports = router;
"""
write_file('routes/trips.js', trips_route)

print("Server configured successfully!")
