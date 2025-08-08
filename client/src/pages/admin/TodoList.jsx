import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TodoList.scss';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get('/api/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.post('/api/todos', { text }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos([data, ...todos]);
      setText('');
    } catch (err) {
      setError('Failed to create todo.');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.put(`/api/todos/${id}`, { completed: !completed }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.map(todo => (todo._id === id ? data : todo)));
    } catch (err) {
      setError('Failed to update todo.');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo.');
    }
  };

  if (loading) return <p>Loading todos...</p>;

  return (
    <div className="todo-list-container">
      <h2>Todo List</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleCreateTodo} className="todo-form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button type="submit">Add</button>
      </form>
      <ul className="todos">
        {todos.map(todo => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => handleToggleComplete(todo._id, todo.completed)}>
              {todo.text}
            </span>
            <button onClick={() => handleDeleteTodo(todo._id)} className="delete-btn">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
