const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  }
}, {
  timestamps: true,
});

// Pre-save hook to generate slug from title
BlogPostSchema.pre('validate', function(next) {
  if (this.title && this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }
  next();
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPost;
