import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FuturePlanManager.scss'; // Reusing GoalManager styles

const FuturePlanManager = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Other', status: 'Idea' });
  const [isEditing, setIsEditing] = useState(null); // To hold the id of the plan being edited

  const fetchPlans = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get('/api/futureplans', { headers: { Authorization: `Bearer ${token}` } });
      setPlans(data);
    } catch (err) {
      setError('Failed to load future plans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('adminToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        if(isEditing) {
            await axios.put(`/api/futureplans/${isEditing}`, formData, config);
        } else {
            await axios.post('/api/futureplans', formData, config);
        }
        setFormData({ title: '', description: '', category: 'Other', status: 'Idea' });
        setIsEditing(null);
        fetchPlans();
    } catch(err) {
        setError('Failed to save plan.');
    }
  };

  const handleEditClick = (plan) => {
      setIsEditing(plan._id);
      setFormData({
          title: plan.title,
          description: plan.description,
          category: plan.category,
          status: plan.status,
          targetDate: plan.targetDate ? new Date(plan.targetDate).toISOString().split('T')[0] : ''
      });
  };

  const handleDelete = async (id) => {
      if(window.confirm('Are you sure?')) {
          try {
              const token = localStorage.getItem('adminToken');
              await axios.delete(`/api/futureplans/${id}`, { headers: { Authorization: `Bearer ${token}` } });
              fetchPlans();
          } catch(err) {
              setError('Failed to delete plan.');
          }
      }
  };

  if (loading) return <p>Loading future plans...</p>;

  return (
    <div className="future-plan-manager-container">
      <h2>Future Plan Manager</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleFormSubmit} className="plan-form">
        <h3>{isEditing ? 'Edit Plan' : 'Create New Plan'}</h3>
        <input name="title" value={formData.title} onChange={handleFormChange} placeholder="Title" required />
        <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Description"></textarea>
        <select name="category" value={formData.category} onChange={handleFormChange}>
            <option>Career</option><option>Personal</option><option>Financial</option><option>Health</option><option>Other</option>
        </select>
        <select name="status" value={formData.status} onChange={handleFormChange}>
            <option>Idea</option><option>Planned</option><option>In Progress</option><option>Achieved</option>
        </select>
        <input type="date" name="targetDate" value={formData.targetDate} onChange={handleFormChange} />
        <div className="form-actions">
            <button type="submit">{isEditing ? 'Update Plan' : 'Add Plan'}</button>
            {isEditing && <button type="button" onClick={() => { setIsEditing(null); setFormData({ title: '', description: ''})}}>Cancel</button>}
        </div>
      </form>

      <div className="plans-list">
        {plans.map(plan => (
          <div key={plan._id} className="plan-card">
            <h4>{plan.title}</h4>
            <p>{plan.description}</p>
            <div className="plan-footer">
              <span>Status: {plan.status}</span>
              <span>Category: {plan.category}</span>
              <div className="plan-actions">
                <button onClick={() => handleEditClick(plan)}>Edit</button>
                <button onClick={() => handleDelete(plan._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FuturePlanManager;
