const mongoose = require('mongoose');

const FuturePlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Career', 'Personal', 'Financial', 'Health', 'Other'],
    default: 'Other',
  },
  targetDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Idea', 'Planned', 'In Progress', 'Achieved'],
    default: 'Idea',
  },
}, {
  timestamps: true,
});

const FuturePlan = mongoose.model('FuturePlan', FuturePlanSchema);

module.exports = FuturePlan;
