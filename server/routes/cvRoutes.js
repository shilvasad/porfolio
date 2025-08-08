const express = require('express');
const router = express.Router();
const { generateCv } = require('../controllers/cvController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/cv/generate
// @desc    Generate and download CV
// @access  Private/Admin
router.get('/generate', protect, admin, generateCv);

module.exports = router;
