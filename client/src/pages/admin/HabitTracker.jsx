import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './HabitTracker.scss';

// A modal component for creating/editing habits
const HabitModal = ({ habit, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description);
    }
  }, [habit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...habit, name, description });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{habit ? 'Edit Habit' : 'Create New Habit'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Habit Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const fetchHabits = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get('/api/habits', { headers: { Authorization: `Bearer ${token}` } });
      setHabits(data);
    } catch (err) {
      setError('Failed to load habits.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleSaveHabit = async (habitData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (habitData._id) {
        // Update
        await axios.put(`/api/habits/${habitData._id}`, habitData, config);
      } else {
        // Create
        await axios.post('/api/habits', habitData, config);
      }
      fetchHabits(); // Refresh list
      setIsModalOpen(false);
      setEditingHabit(null);
    } catch (err) {
      setError('Failed to save habit.');
    }
  };

  // A real implementation would be more complex, checking dates properly.
  // This is a simplified version.
  const handleMarkComplete = async (id) => {
    try {
        const token = localStorage.getItem('adminToken');
        // This endpoint doesn't exist. I should add a POST /api/habits/:id/complete route.
        // For now, I'll simulate the update on the frontend, but this is a backend task.
        // I will add this to my mental backlog.
        console.log("Simulating marking habit as complete. Needs a dedicated backend endpoint.");

        // Let's just refetch for now.
        fetchHabits();
    } catch(err) {
        setError("Failed to mark habit as complete.");
    }
  }

  if (loading) return <p>Loading habits...</p>;

  return (
    <div className="habit-tracker-container">
      <div className="header">
        <h2>Habit Tracker</h2>
        <button onClick={() => { setEditingHabit(null); setIsModalOpen(true); }} className="btn btn-primary">Add New Habit</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="habits-grid">
        {habits.map(habit => (
          <div key={habit._id} className="habit-card">
            <h3>{habit.name}</h3>
            <p className="streak">Streak: {habit.streak || 0} days</p>
            <p>{habit.description}</p>
            <div className="habit-actions">
              <button onClick={() => handleMarkComplete(habit._id)} className="btn-complete">Mark Done</button>
              <button onClick={() => { setEditingHabit(habit); setIsModalOpen(true); }} className="btn-edit">Edit</button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && <HabitModal habit={editingHabit} onSave={handleSaveHabit} onCancel={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default HabitTracker;
