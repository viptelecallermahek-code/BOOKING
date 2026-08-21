import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FiSearch, FiPhone, FiMail, FiMessageCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { AuthContext } from '../App';
import '../styles/Customers.css';

function Customers() {
  const { API_URL, token } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPhone, setExpandedPhone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    applySearch();
  }, [customers, searchTerm]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data.customers);
    } catch (error) {
      setError('Failed to load customers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applySearch = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(c =>
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phoneNumber.includes(searchTerm) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const openWhatsApp = (customer) => {
    const phone = customer.whatsappNumber || customer.phoneNumber;
    const message = `Hello ${customer.customerName}, thank you for booking with us! We look forward to your visit.`;
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openEmail = (email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const openPhone = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  if (loading) return <div className="loading">Loading customers...</div>;

  return (
    <div className="customers-container">
      <div className="page-header">
        <h1>Customers</h1>
        <p>View all your customers and their booking history</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Search Section */}
      <div className="search-section">
        <div className="search-box">
          <FiSearch size={20} />
          <input
            type="text"
            placeholder="Search by name, phone, or email"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="results-count">
          {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length > 0 ? (
        <div className="customers-grid">
          {filteredCustomers.map((customer) => (
            <div key={customer.phoneNumber} className="customer-card">
              <div className="customer-header">
                <div className="customer-avatar">
                  {customer.customerName.charAt(0).toUpperCase()}
                </div>
                <div className="customer-title">
                  <h3>{customer.customerName}</h3>
                  <p className="customer-location">{customer.cityState || 'Location not specified'}</p>
                </div>
              </div>

              <div className="customer-details">
                <div className="detail">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{customer.phoneNumber}</span>
                </div>

                {customer.email && (
                  <div className="detail">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{customer.email}</span>
                  </div>
                )}

                <div className="detail">
                  <span className="detail-label">Total Bookings</span>
                  <span className="detail-value">{customer.totalBookings}</span>
                </div>

                <div className="detail">
                  <span className="detail-label">Total Spent</span>
                  <span className="detail-value">₹ {customer.totalSpent?.toLocaleString('en-IN')}</span>
                </div>

                {customer.lastBookingDate && (
                  <div className="detail">
                    <span className="detail-label">Last Booking</span>
                    <span className="detail-value">
                      {new Date(customer.lastBookingDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              <div className="customer-actions">
                <button className="action-btn call-btn" onClick={() => openPhone(customer.phoneNumber)} title="Call">
                  <FiPhone size={18} />
                </button>
                {customer.email && (
                  <button className="action-btn email-btn" onClick={() => openEmail(customer.email)} title="Email">
                    <FiMail size={18} />
                  </button>
                )}
                <button className="action-btn whatsapp-btn" onClick={() => openWhatsApp(customer)} title="WhatsApp">
                  <FiMessageCircle size={18} />
                </button>
                <button
                  className="action-btn expand-btn"
                  onClick={() => setExpandedPhone(expandedPhone === customer.phoneNumber ? null : customer.phoneNumber)}
                  title="View History"
                >
                  {expandedPhone === customer.phoneNumber ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </button>
              </div>

              {expandedPhone === customer.phoneNumber && (
                <div className="booking-history">
                  <h4>Booking History</h4>
                  {customer.bookings && customer.bookings.length > 0 ? (
                    <div className="history-list">
                      {customer.bookings.map((booking, idx) => (
                        <div key={idx} className="history-item">
                          <p className="history-package">{booking.packageName || 'Package'}</p>
                          <p className="history-date">
                            {new Date(booking.arrivalDate).toLocaleDateString('en-IN')}
                          </p>
                          <p className="history-amount">₹ {booking.totalPackageAmount?.toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-history">No booking history available</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-customers">
          <p>No customers found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}

export default Customers;
