const BlogPost = require('../models/BlogPost');

// @desc    Fetch all published blog posts
// @route   GET /api/blog
// @access  Public
const getPublishedBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch a single blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
const getBlogPostBySlug = async (req, res) => {
    try {
      const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' });
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: 'Blog post not found or not published' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };

// @desc    Fetch all blog posts (published and drafts)
// @route   GET /api/blog/all
// @access  Private/Admin
const getAllBlogPosts = async (req, res) => {
    try {
      const posts = await BlogPost.find({}).sort({ createdAt: -1 });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };

// @desc    Fetch a single blog post by ID for editing
// @route   GET /api/blog/:id/edit
// @access  Private/Admin
const getBlogPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a blog post
// @route   POST /api/blog
// @access  Private/Admin
const createBlogPost = async (req, res) => {
  const { title, content, status, tags } = req.body;
  try {
    const post = new BlogPost({
      title,
      content,
      status,
      tags,
      author: req.user._id, // from authMiddleware
    });
    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error: error.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
const updateBlogPost = async (req, res) => {
  const { title, content, status, tags } = req.body;
  try {
    const post = await BlogPost.findById(req.params.id);
    if (post) {
      post.title = title || post.title;
      post.content = content || post.content;
      post.status = status || post.status;
      post.tags = tags || post.tags;

      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating post', error: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (post) {
      await post.remove();
      res.json({ message: 'Blog post removed' });
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
