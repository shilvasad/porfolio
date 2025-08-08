const express = require('express');
const router = express.Router();
const { registerAdmin, login } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register admin
// @access  Public
router.post('/register', registerAdmin);

// @route   POST api/auth/login
// @desc    Login admin
// @access  Public
router.post('/login', login);

module.exports = router;
