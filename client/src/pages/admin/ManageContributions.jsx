import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ManageContributions.scss';

const ManageContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchContributions = async () => {
    setLoading(true);
    try {
      // Public endpoint is fine for getting all contributions
      const { data } = await axios.get('/api/contributions');
      setContributions(data);
    } catch (err) {
      setError('Failed to load contributions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contribution?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`/api/contributions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchContributions(); // Refresh list
      } catch (err) {
        setError('Failed to delete the contribution.');
      }
    }
  };

  if (loading) return <p>Loading contributions...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="manage-contributions-container">
      <div className="header">
        <h2>Manage Contributions</h2>
        <Link to="/admin/contributions/new" className="btn btn-primary">Add New Contribution</Link>
      </div>
      <div className="contributions-list-admin">
        {contributions.length > 0 ? (
          contributions.map(item => (
            <div key={item._id} className="contribution-item-admin">
              <div className="info">
                <h3>{item.title}</h3>
                <p>{item.type} - {new Date(item.date).toLocaleDateString()}</p>
              </div>
              <div className="actions">
                <Link to={`/admin/contributions/edit/${item._id}`} className="btn btn-secondary">Edit</Link>
                <button onClick={() => handleDelete(item._id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No contributions found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageContributions;
