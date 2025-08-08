import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.scss';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Panel</h2>
        <nav className="admin-nav">
          <ul>
            <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/admin/profile">Manage Profile</NavLink></li>
            <li><NavLink to="/admin/blog">Manage Blog</NavLink></li>
            <li><NavLink to="/admin/contributions">Manage Contributions</NavLink></li>
            <li><NavLink to="/admin/todos">Todo List</NavLink></li>
            <li><NavLink to="/admin/habits">Habit Tracker</NavLink></li>
            <li><NavLink to="/admin/goals">Goal Manager</NavLink></li>
            <li><NavLink to="/admin/mindmaps">Mind Maps</NavLink></li>
            <li><NavLink to="/admin/futureplans">Future Plans</NavLink></li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </aside>
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
