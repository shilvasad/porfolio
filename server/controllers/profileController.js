const Profile = require('../models/Profile');

/**
 * @desc    Get the portfolio profile
 * @route   GET /api/profile
 * @access  Public
 */
const getProfile = async (req, res) => {
  try {
    // There should only be one profile document.
    const profile = await Profile.findOne();
    if (!profile) {
      // If no profile exists, we can create a default one.
      const defaultProfile = await Profile.create({});
      return res.json(defaultProfile);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Create or update the portfolio profile
 * @route   PUT /api/profile
 * @access  Private/Admin
 */
const updateProfile = async (req, res) => {
  try {
    // Find the single profile document and update it.
    // The `new: true` option returns the document after update.
    // The `upsert: true` option creates the object if it doesn't exist.
    const updatedProfile = await Profile.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
