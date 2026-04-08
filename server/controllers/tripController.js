const Trip = require('../models/Trip');

function calculateSettlements(members, expenses) {
  const balances = {};
  
  members.forEach(m => balances[m] = 0);

  expenses.forEach(expense => {
    balances[expense.payer] += expense.amount;
    for (const [userId, share] of Array.from(expense.shares.entries())) {
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
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const settlements = calculateSettlements(trip.members, trip.expenses);
    res.status(200).json({ trip, settlements });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trip' });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const { name } = req.body; 

    const newTrip = new Trip({
      name,
      owner: req.user.userId,
      members: [], // Start without members
      expenses: []
    });

    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(500).json({ message: 'Error creating trip', error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { name } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    
    if (trip.members.includes(name)) {
        return res.status(400).json({ message: 'Member already exists' });
    }

    trip.members.push(name);
    await trip.save();

    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Error adding member', error: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { name } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const isInvolved = trip.expenses.some(e => e.payer === name || e.shares.has(name));
    if (isInvolved) {
        return res.status(400).json({ message: 'Cannot remove member involved in expenses' });
    }

    trip.members = trip.members.filter(m => m !== name);
    await trip.save();

    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Error removing member', error: err.message });
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

exports.removeExpense = async (req, res) => {
  try {
    const { tripId, expenseId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    trip.expenses = trip.expenses.filter(e => e._id.toString() !== expenseId);
    await trip.save();

    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Error removing expense', error: err.message });
  }
};