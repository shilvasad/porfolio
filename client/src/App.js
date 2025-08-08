import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

// Styling
import './App.scss';

// Components
import PrivateRoute from './components/PrivateRoute';
import PublicLayout from './components/PublicLayout';

// Pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageProfile from './pages/admin/ManageProfile';
import TodoList from './pages/admin/TodoList';
import HabitTracker from './pages/admin/HabitTracker';
import GoalManager from './pages/admin/GoalManager';
import MindMapEditor from './pages/admin/MindMapEditor';
import FuturePlanManager from './pages/admin/FuturePlanManager';
import ManageBlog from './pages/admin/ManageBlog';
import EditBlogPost from './pages/admin/EditBlogPost';
import ManageContributions from './pages/admin/ManageContributions';
import EditContribution from './pages/admin/EditContribution';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContributionsPage from './pages/ContributionsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes with Navbar */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contributions" element={<ContributionsPage />} />
          </Route>

          {/* Standalone Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Private Admin Routes */}
          <Route path="/admin" element={<PrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="profile" element={<ManageProfile />} />
              <Route path="blog" element={<ManageBlog />} />
              <Route path="blog/new" element={<EditBlogPost />} />
              <Route path="blog/edit/:id" element={<EditBlogPost />} />
              <Route path="contributions" element={<ManageContributions />} />
              <Route path="contributions/new" element={<EditContribution />} />
              <Route path="contributions/edit/:id" element={<EditContribution />} />
              <Route path="todos" element={<TodoList />} />
              <Route path="habits" element={<HabitTracker />} />
              <Route path="goals" element={<GoalManager />} />
              <Route path="mindmaps" element={<MindMapEditor />} />
              <Route path="futureplans" element={<FuturePlanManager />} />
              {/* Add other admin routes here as children */}
            </Route>
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
