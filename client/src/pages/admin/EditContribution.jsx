import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditContribution.scss';

const EditContribution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: '',
    technologies: '',
    date: new Date().toISOString().split('T')[0],
    type: 'project',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchContribution = async () => {
        try {
          // NOTE: I need to add a GET /api/contributions/:id endpoint.
          // The public one gets all, not one.
          const { data } = await axios.get(`/api/contributions/${id}`);
          setFormData({
            title: data.title,
            description: data.description,
            projectUrl: data.projectUrl,
            technologies: data.technologies.join(', '),
            date: new Date(data.date).toISOString().split('T')[0],
            type: data.type,
          });
        } catch (err) {
          setError('Failed to load contribution data.');
        } finally {
          setLoading(false);
        }
      };
      fetchContribution();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const contributionData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
    };

    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      if (id) {
        await axios.put(`/api/contributions/${id}`, contributionData, config);
        setSuccess('Contribution updated successfully!');
      } else {
        await axios.post('/api/contributions', contributionData, config);
        setSuccess('Contribution created successfully!');
      }
      setTimeout(() => navigate('/admin/contributions'), 1500);
    } catch (err) {
      setError('An error occurred. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-contribution-container">
      <h2>{id ? 'Edit Contribution' : 'Add New Contribution'}</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="contribution-form">
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label>Project URL</label>
          <input type="text" name="projectUrl" value={formData.projectUrl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Technologies (comma-separated)</label>
          <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="project">Project</option>
            <option value="open-source">Open Source</option>
            <option value="publication">Publication</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Contribution'}
        </button>
      </form>
    </div>
  );
};

export default EditContribution;
