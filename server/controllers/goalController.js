const Goal = require('../models/Goal');

// @desc    Get all goals for the logged-in user
// @route   GET /api/goals
// @access  Private/Admin
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ dueDate: 'asc' });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private/Admin
const createGoal = async (req, res) => {
  try {
    const goal = new Goal({
      ...req.body,
      user: req.user._id,
    });
    const createdGoal = await goal.save();
    res.status(201).json(createdGoal);
  } catch (error) {
    res.status(400).json({ message: 'Error creating goal', error: error.message });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private/Admin
const updateGoal = async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Error updating goal', error: error.message });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private/Admin
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await goal.remove();
    res.json({ message: 'Goal removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
