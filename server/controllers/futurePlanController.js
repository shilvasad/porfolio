const FuturePlan = require('../models/FuturePlan');

// @desc    Get all future plans for the logged-in user
// @route   GET /api/futureplans
// @access  Private/Admin
const getFuturePlans = async (req, res) => {
  try {
    const plans = await FuturePlan.find({ user: req.user._id }).sort({ targetDate: 'asc' });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new future plan
// @route   POST /api/futureplans
// @access  Private/Admin
const createFuturePlan = async (req, res) => {
  try {
    const plan = new FuturePlan({
      ...req.body,
      user: req.user._id,
    });
    const createdPlan = await plan.save();
    res.status(201).json(createdPlan);
  } catch (error) {
    res.status(400).json({ message: 'Error creating plan', error: error.message });
  }
};

// @desc    Update a future plan
// @route   PUT /api/futureplans/:id
// @access  Private/Admin
const updateFuturePlan = async (req, res) => {
  try {
    let plan = await FuturePlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    plan = await FuturePlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: 'Error updating plan', error: error.message });
  }
};

// @desc    Delete a future plan
// @route   DELETE /api/futureplans/:id
// @access  Private/Admin
const deleteFuturePlan = async (req, res) => {
  try {
    const plan = await FuturePlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await plan.remove();
    res.json({ message: 'Plan removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getFuturePlans,
  createFuturePlan,
  updateFuturePlan,
  deleteFuturePlan,
};
