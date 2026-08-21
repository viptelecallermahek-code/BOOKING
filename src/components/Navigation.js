import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiHome,
  FiPlus,
  FiList,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import '../styles/Navigation.css';

function Navigation({ user, onLogout }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/add-booking', label: 'Add New Booking', icon: FiPlus },
    { path: '/bookings', label: 'All Bookings', icon: FiList },
    { path: '/calendar', label: 'Calendar', icon: FiCalendar },
    { path: '/customers', label: 'Customers', icon: FiUsers },
    { path: '/reports', label: 'Reports', icon: FiBarChart2 },
    { path: '/settings', label: 'Settings', icon: FiSettings }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="logo-icon">📦</div>
          <span>Goa Package Manager</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Menu Items */}
        <div className={`nav-menu ${isMobileOpen ? 'active' : ''}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{user?.role || 'staff'}</span>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
