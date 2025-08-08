import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ManageBlog.scss';

const ManageBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Fetches all posts, including drafts
      const { data } = await axios.get('/api/blog/all', config);
      setPosts(data);
    } catch (err) {
      setError('Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`/api/blog/${id}`, config);
        // Refresh the posts list
        fetchPosts();
      } catch (err) {
        setError('Failed to delete the post.');
      }
    }
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="manage-blog-container">
      <div className="header">
        <h2>Manage Blog Posts</h2>
        <Link to="/admin/blog/new" className="btn btn-primary">Create New Post</Link>
      </div>
      <table className="posts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map(post => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>
                  <span className={`status-badge status-${post.status}`}>
                    {post.status}
                  </span>
                </td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <Link to={`/admin/blog/edit/${post._id}`} className="btn btn-secondary">Edit</Link>
                  <button onClick={() => handleDelete(post._id)} className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No posts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBlog;
