const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  projectUrl: {
    type: String,
  },
  technologies: {
    type: [String],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['project', 'open-source', 'publication', 'other'],
    default: 'project',
  }
}, {
  timestamps: true,
});

const Contribution = mongoose.model('Contribution', ContributionSchema);

module.exports = Contribution;
