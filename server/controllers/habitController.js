const Habit = require('../models/Habit');

// @desc    Get all habits for the logged-in user
// @route   GET /api/habits
// @access  Private/Admin
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: 'desc' });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private/Admin
const createHabit = async (req, res) => {
  const { name, description } = req.body;
  try {
    const habit = new Habit({
      name,
      description,
      user: req.user._id,
    });
    const createdHabit = await habit.save();
    res.status(201).json(createdHabit);
  } catch (error) {
    res.status(400).json({ message: 'Error creating habit', error: error.message });
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private/Admin
const updateHabit = async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: 'Error updating habit', error: error.message });
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private/Admin
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await habit.remove();
    res.json({ message: 'Habit removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Logic to mark habit as complete for today could go here
// For example, a POST /api/habits/:id/complete route

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
};
