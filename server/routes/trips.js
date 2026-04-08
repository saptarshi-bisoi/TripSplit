const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');

router.use(auth);

// Get all trips for logged in user (where they are owner!)
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ owner: req.user.userId });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', tripController.createTrip);
router.get('/:tripId', tripController.getTripDetails);

router.post('/:tripId/members', tripController.addMember);
router.delete('/:tripId/members', tripController.removeMember); // Expecting { name } in body or query

router.post('/:tripId/expenses', tripController.addExpense);
router.delete('/:tripId/expenses/:expenseId', tripController.removeExpense);

module.exports = router;