import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          MyPortfolio
        </NavLink>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>Home</NavLink>
          </li>
          <li>
            <NavLink to="/blog">Blog</NavLink>
          </li>
          <li>
            <NavLink to="/contributions">Contributions</NavLink>
          </li>
          {/* Link to admin login */}
          <li>
            <NavLink to="/login" className="nav-login">Admin</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
