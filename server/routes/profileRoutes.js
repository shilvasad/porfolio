const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET api/profile
// @desc    Get profile information
// @access  Public
router.get('/', getProfile);

// @route   PUT api/profile
// @desc    Update profile information
// @access  Private/Admin
router.put('/', protect, admin, updateProfile);

module.exports = router;
