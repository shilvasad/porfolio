const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
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
    trim: true,
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    default: 'Not Started',
  },
  dueDate: {
    type: Date,
  },
  // For breaking down a goal into smaller steps
  actionItems: [{
    text: String,
    completed: { type: Boolean, default: false }
  }]
}, {
  timestamps: true,
});

const Goal = mongoose.model('Goal', GoalSchema);

module.exports = Goal;
