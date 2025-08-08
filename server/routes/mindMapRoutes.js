const express = require('express');
const router = express.Router();
const {
  getMindMaps,
  getMindMapById,
  createMindMap,
  updateMindMap,
  deleteMindMap,
} = require('../controllers/mindMapController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes here are protected
router.use(protect, admin);

router.route('/')
  .get(getMindMaps)
  .post(createMindMap);

router.route('/:id')
  .get(getMindMapById)
  .put(updateMindMap)
  .delete(deleteMindMap);

module.exports = router;
