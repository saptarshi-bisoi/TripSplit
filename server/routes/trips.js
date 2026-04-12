const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');
const User = require('../models/User'); // Gap Fix #2: needed for invite-by-email lookup

router.use(auth);

// Gap Fix #2: return trips the user OWNS or has been INVITED to
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [
        { owner: req.user.userId },
        { memberEmails: req.user.email } // req.user.email now available from JWT payload
      ]
    });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', tripController.createTrip);
router.get('/:tripId', tripController.getTripDetails);

router.post('/:tripId/members', tripController.addMember);
router.delete('/:tripId/members', tripController.removeMember);

router.post('/:tripId/expenses', tripController.addExpense);
router.delete('/:tripId/expenses/:expenseId', tripController.removeExpense);

// ── Gap Fix #2: Invite a registered TripSplit user to a trip by email ─────
router.post('/:tripId/invite', async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Only the trip owner may invite
    if (trip.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the trip owner can invite members' });
    }

    // Prevent duplicate invites
    if (trip.memberEmails && trip.memberEmails.includes(email)) {
      return res.status(400).json({ message: 'This user has already been invited to this trip' });
    }

    // Resolve email to a registered User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'No TripSplit account found for that email. Ask them to sign up first!'
      });
    }

    // Add display name (if not already present) and link email for access control
    if (!trip.members.includes(user.name)) {
      trip.members.push(user.name);
    }
    trip.memberEmails.push(email);

    await trip.save();
    res.status(200).json({ trip, memberName: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Error inviting member', error: err.message });
  }
});

module.exports = router;