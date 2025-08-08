const MindMap = require('../models/MindMap');

// @desc    Get all mind maps for the logged-in user
// @route   GET /api/mindmaps
// @access  Private/Admin
const getMindMaps = async (req, res) => {
  try {
    const mindMaps = await MindMap.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(mindMaps);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single mind map by ID
// @route   GET /api/mindmaps/:id
// @access  Private/Admin
const getMindMapById = async (req, res) => {
  try {
    const mindMap = await MindMap.findById(req.params.id);
    if (!mindMap) {
      return res.status(404).json({ message: 'Mind map not found' });
    }
    if (mindMap.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(mindMap);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new mind map
// @route   POST /api/mindmaps
// @access  Private/Admin
const createMindMap = async (req, res) => {
  const { title, data } = req.body;
  try {
    const mindMap = new MindMap({
      title,
      data,
      user: req.user._id,
    });
    const createdMindMap = await mindMap.save();
    res.status(201).json(createdMindMap);
  } catch (error) {
    res.status(400).json({ message: 'Error creating mind map', error: error.message });
  }
};

// @desc    Update a mind map
// @route   PUT /api/mindmaps/:id
// @access  Private/Admin
const updateMindMap = async (req, res) => {
  try {
    let mindMap = await MindMap.findById(req.params.id);
    if (!mindMap) {
      return res.status(404).json({ message: 'Mind map not found' });
    }
    if (mindMap.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    mindMap = await MindMap.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(mindMap);
  } catch (error) {
    res.status(400).json({ message: 'Error updating mind map', error: error.message });
  }
};

// @desc    Delete a mind map
// @route   DELETE /api/mindmaps/:id
// @access  Private/Admin
const deleteMindMap = async (req, res) => {
  try {
    const mindMap = await MindMap.findById(req.params.id);
    if (!mindMap) {
      return res.status(404).json({ message: 'Mind map not found' });
    }
    if (mindMap.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await mindMap.remove();
    res.json({ message: 'Mind map removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getMindMaps,
  getMindMapById,
  createMindMap,
  updateMindMap,
  deleteMindMap,
};
