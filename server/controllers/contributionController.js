const Contribution = require('../models/Contribution');

// @desc    Fetch all contributions
// @route   GET /api/contributions
// @access  Public
const getContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({}).sort({ date: -1 });
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch a single contribution by ID
// @route   GET /api/contributions/:id
// @access  Public
const getContributionById = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (contribution) {
      res.json(contribution);
    } else {
      res.status(404).json({ message: 'Contribution not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a contribution
// @route   POST /api/contributions
// @access  Private/Admin
const createContribution = async (req, res) => {
  const { title, description, projectUrl, technologies, date, type } = req.body;
  try {
    const contribution = new Contribution({
      title,
      description,
      projectUrl,
      technologies,
      date,
      type,
    });
    const createdContribution = await contribution.save();
    res.status(201).json(createdContribution);
  } catch (error) {
    res.status(400).json({ message: 'Error creating contribution', error: error.message });
  }
};

// @desc    Update a contribution
// @route   PUT /api/contributions/:id
// @access  Private/Admin
const updateContribution = async (req, res) => {
  const { title, description, projectUrl, technologies, date, type } = req.body;
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (contribution) {
      contribution.title = title || contribution.title;
      contribution.description = description || contribution.description;
      contribution.projectUrl = projectUrl || contribution.projectUrl;
      contribution.technologies = technologies || contribution.technologies;
      contribution.date = date || contribution.date;
      contribution.type = type || contribution.type;

      const updatedContribution = await contribution.save();
      res.json(updatedContribution);
    } else {
      res.status(404).json({ message: 'Contribution not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating contribution', error: error.message });
  }
};

// @desc    Delete a contribution
// @route   DELETE /api/contributions/:id
// @access  Private/Admin
const deleteContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (contribution) {
      await contribution.remove();
      res.json({ message: 'Contribution removed' });
    } else {
      res.status(404).json({ message: 'Contribution not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getContributions,
  getContributionById,
  createContribution,
  updateContribution,
  deleteContribution,
};
