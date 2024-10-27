// Layout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css'; // Assumes you want to use the same styles for consistency

const Layout = () => {
  return (
    <div className="dashboard">
      <aside className="side-menu open">
        <div className="side-menu-content">
          <h2>Student Research Center</h2>
          <ul>
            <li><Link to="/logs">Logs</Link></li>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </div>
      </aside>

      <div className="main-content">
        <Outlet /> {/* This renders Dashboard or Log based on the route */}
      </div>
    </div>
  );
};

export default Layout;
