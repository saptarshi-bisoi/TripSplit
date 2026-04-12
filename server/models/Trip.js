const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  payer: { type: String, required: true },
  shares: {
    type: Map,
    of: Number,
    required: true
  }
});

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: String }],
  // Gap Fix #2: parallel array of registered-user emails for access control.
  // The members[] name array is preserved for all expense/settlement logic.
  memberEmails: [{ type: String }],
  expenses: [expenseSchema]
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);