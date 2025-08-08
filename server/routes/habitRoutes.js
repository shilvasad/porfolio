const express = require('express');
const router = express.Router();
const {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
} = require('../controllers/habitController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes here are protected
router.use(protect, admin);

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.route('/:id')
  .put(updateHabit)
  .delete(deleteHabit);

module.exports = router;
