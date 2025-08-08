import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './GoalManager.scss';

// This component will be simplified for now. A full implementation
// would likely have a separate page or a more complex modal for editing/creating goals
// due to the 'actionItems'.

const GoalManager = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // For simplicity, we'll do create/edit inline for now.
  const [newGoalTitle, setNewGoalTitle] = useState('');

  const fetchGoals = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get('/api/goals', { headers: { Authorization: `Bearer ${token}` } });
      setGoals(data);
    } catch (err) {
      setError('Failed to load goals.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('/api/goals', { title: newGoalTitle }, { headers: { Authorization: `Bearer ${token}` } });
      setNewGoalTitle('');
      fetchGoals();
    } catch (err) {
      setError('Failed to create goal.');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
        const token = localStorage.getItem('adminToken');
        await axios.put(`/api/goals/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
        fetchGoals();
    } catch(err) {
        setError('Failed to update goal status.');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure?')) {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/goals/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchGoals();
        } catch(err) {
            setError('Failed to delete goal.');
        }
    }
  };

  if (loading) return <p>Loading goals...</p>;

  return (
    <div className="goal-manager-container">
      <h2>Goal Manager</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleCreateGoal} className="goal-form">
        <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="Add a new high-level goal..."
        />
        <button type="submit">Add Goal</button>
      </form>
      <div className="goals-list">
        {goals.map(goal => (
          <div key={goal._id} className="goal-card">
            <div className="goal-header">
                <h4>{goal.title}</h4>
                <div className="goal-actions">
                    {/* A full implementation would have an edit button linking to a new page */}
                    <button onClick={() => handleDeleteGoal(goal._id)} className="btn-delete">Delete</button>
                </div>
            </div>
            <p>{goal.description || 'No description.'}</p>
            <div className="goal-footer">
                <span>Status:</span>
                <select value={goal.status} onChange={(e) => handleUpdateStatus(goal._id, e.target.value)}>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>On Hold</option>
                    <option>Completed</option>
                </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalManager;
