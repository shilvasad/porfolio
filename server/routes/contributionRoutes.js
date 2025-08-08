const express = require('express');
const router = express.Router();
const {
  getContributions,
  getContributionById,
  createContribution,
  updateContribution,
  deleteContribution,
} = require('../controllers/contributionController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getContributions);
router.get('/:id', getContributionById); // For fetching a single item

// Protected admin routes
router.post('/', protect, admin, createContribution);
router.put('/:id', protect, admin, updateContribution);
router.delete('/:id', protect, admin, deleteContribution);

module.exports = router;
