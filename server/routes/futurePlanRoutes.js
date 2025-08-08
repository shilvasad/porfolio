const express = require('express');
const router = express.Router();
const {
  getFuturePlans,
  createFuturePlan,
  updateFuturePlan,
  deleteFuturePlan,
} = require('../controllers/futurePlanController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes here are protected
router.use(protect, admin);

router.route('/')
  .get(getFuturePlans)
  .post(createFuturePlan);

router.route('/:id')
  .put(updateFuturePlan)
  .delete(deleteFuturePlan);

module.exports = router;
