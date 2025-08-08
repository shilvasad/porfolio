const mongoose = require('mongoose');

const MindMapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Please add a title for the mind map'],
    trim: true,
  },
  // Storing the mind map data as a flexible JSON object.
  // This can be structured as a tree (e.g., { id: 'root', content: '...', children: [...] })
  // on the frontend and saved here.
  data: {
    type: Object,
    required: true,
    default: {
      id: 'root',
      text: 'Central Idea',
      children: [],
    },
  },
}, {
  timestamps: true,
});

const MindMap = mongoose.model('MindMap', MindMapSchema);

module.exports = MindMap;
