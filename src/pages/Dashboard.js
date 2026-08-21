import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FiBarChart2,
  FiCheckCircle,
  FiAlertCircle,
  FiUsers,
  FiTrendingUp,
  FiClock,
  FiX,
  FiChevronRight,
  FiDollarSign,
  FiCalendar
} from 'react-icons/fi';
import { AuthContext } from '../App';
import '../styles/Dashboard.css';

function Dashboard() {
  const { API_URL, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      setError('Failed to load dashboard stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's an overview of your bookings and business metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <FiBarChart2 color="#4f46e5" size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Bookings</p>
            <p className="stat-value">{stats?.totalBookings || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>
            <FiCheckCircle color="#15803d" size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Today's Arrivals</p>
            <p className="stat-value">{stats?.todayArrivals || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <FiClock color="#d97706" size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Upcoming (7 Days)</p>
            <p className="stat-value">{stats?.upcomingArrivals || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ddd6fe' }}>
            <FiUsers color="#7c3aed" size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Customers</p>
            <p className="stat-value">{stats?.totalCustomers || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fed7aa' }}>
            <FiAlertCircle color="#ea580c" size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Payments</p>
            <p className="stat-value">{stats?.pendingPaymentCount || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e8ff' }}>
            <FiTrendingUp color="#a855f7" size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <p className="stat-value">{stats?.completedPackages || 0}</p>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="financial-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FiDollarSign size={28} />
          </div>
          <div className="summary-content">
            <p className="summary-label">Total Revenue</p>
            <p className="summary-value">₹ {(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
            <p className="summary-subtext">From all bookings</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon warning">
            <FiAlertCircle size={28} />
          </div>
          <div className="summary-content">
            <p className="summary-label">Pending Amount</p>
            <p className="summary-value">₹ {(stats?.totalPendingAmount || 0).toLocaleString('en-IN')}</p>
            <p className="summary-subtext">To be collected</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon success">
            <FiCheckCircle size={28} />
          </div>
          <div className="summary-content">
            <p className="summary-label">Cancelled Bookings</p>
            <p className="summary-value">{stats?.cancelledBookings || 0}</p>
            <p className="summary-subtext">This month</p>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Entries</h2>
          <Link to="/bookings" className="view-all">
            View All <FiChevronRight size={16} />
          </Link>
        </div>

        <div className="recent-list">
          {stats?.recentEntries && stats.recentEntries.length > 0 ? (
            stats.recentEntries.map((booking) => (
              <div key={booking._id} className="recent-item">
                <div className="recent-info">
                  <p className="recent-name">{booking.customerName}</p>
                  <p className="recent-package">{booking.packageName}</p>
                  <p className="recent-date">
                    <FiCalendar size={14} />
                    {new Date(booking.arrivalDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="recent-amount">
                  <p className="amount">₹ {booking.totalPackageAmount?.toLocaleString('en-IN')}</p>
                  <span className={`badge badge-${getStatusClass(booking.bookingStatus)}`}>
                    {booking.bookingStatus}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No recent bookings</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/add-booking" className="action-btn primary">
            <FiBarChart2 size={20} />
            Add New Booking
          </Link>
          <Link to="/bookings" className="action-btn secondary">
            <FiBarChart2 size={20} />
            View All Bookings
          </Link>
          <Link to="/reports" className="action-btn secondary">
            <FiBarChart2 size={20} />
            Generate Reports
          </Link>
          <Link to="/calendar" className="action-btn secondary">
            <FiCalendar size={20} />
            Calendar View
          </Link>
        </div>
      </div>
    </div>
  );
}

function getStatusClass(status) {
  const statusMap = {
    'New Booking': 'info',
    'Confirmed': 'success',
    'Arrived': 'info',
    'In Progress': 'warning',
    'Completed': 'success',
    'Cancelled': 'danger'
  };
  return statusMap[status] || 'info';
}

export default Dashboard;
