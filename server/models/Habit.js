const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please add a name for the habit'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastCompleted: {
    type: Date,
  },
  // To track completion history
  completedDates: {
      type: [Date],
      default: []
  }
}, {
  timestamps: true,
});

const Habit = mongoose.model('Habit', HabitSchema);

module.exports = Habit;
