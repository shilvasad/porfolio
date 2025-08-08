const express = require('express');
const router = express.Router();
const {
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPublishedBlogPosts);
router.get('/:slug', getBlogPostBySlug);

// Protected admin routes
router.post('/', protect, admin, createBlogPost);
router.get('/all', protect, admin, getAllBlogPosts);
router.get('/:id/edit', protect, admin, getBlogPostById); // For fetching post data to edit
router.put('/:id', protect, admin, updateBlogPost);
router.delete('/:id', protect, admin, deleteBlogPost);


module.exports = router;
