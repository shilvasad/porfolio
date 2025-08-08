import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BlogPage.scss';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('/api/blog');
        setPosts(data);
      } catch (err) {
        setError('Failed to load blog posts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="loader">Loading posts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="blog-container">
      <h1>Blog</h1>
      <div className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <h2>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="post-meta">
                Published on {new Date(post.createdAt).toLocaleDateString()}
              </p>
              {/* We could add a snippet of the content here if we wanted */}
            </div>
          ))
        ) : (
          <p>No blog posts have been published yet.</p>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
