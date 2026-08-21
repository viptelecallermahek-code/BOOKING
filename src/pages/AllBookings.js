import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiPhone,
  FiMail,
  FiMessageCircle
} from 'react-icons/fi';
import { AuthContext } from '../App';
import '../styles/AllBookings.css';

function AllBookings() {
  const { API_URL, token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.bookings);
    } catch (error) {
      setError('Failed to load bookings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = bookings;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(b =>
        b.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        b.phoneNumber.includes(filters.search) ||
        b.bookingId.includes(filters.search)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(b => b.bookingStatus === filters.status);
    }

    // Date range filter
    if (filters.startDate) {
      filtered = filtered.filter(b => new Date(b.arrivalDate) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(b => new Date(b.arrivalDate) <= new Date(filters.endDate));
    }

    setFilteredBookings(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`${API_URL}/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBookings();
      } catch (error) {
        alert('Failed to delete booking');
      }
    }
  };

  const handlePrint = (booking) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
      <h1>Booking Details</h1>
      <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
      <p><strong>Customer Name:</strong> ${booking.customerName}</p>
      <p><strong>Phone:</strong> ${booking.phoneNumber}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Arrival Date:</strong> ${new Date(booking.arrivalDate).toLocaleDateString()}</p>
      <p><strong>Departure Date:</strong> ${new Date(booking.departureDate).toLocaleDateString()}</p>
      <p><strong>Package:</strong> ${booking.packageName}</p>
      <p><strong>Amount:</strong> ₹${booking.totalPackageAmount}</p>
      <p><strong>Status:</strong> ${booking.bookingStatus}</p>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = (booking) => {
    const data = JSON.stringify(booking, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', `booking_${booking.bookingId}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const openWhatsApp = (booking) => {
    const phone = booking.whatsappNumber || booking.phoneNumber;
    const message = `Hello ${booking.customerName}, your Goa package booking has been confirmed. Your arrival date is ${new Date(booking.arrivalDate).toLocaleDateString()}. Thank you!`;
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="all-bookings">
      <div className="page-header">
        <h1>All Bookings</h1>
        <p>Manage and view all customer bookings</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <FiSearch size={20} />
          <input
            type="text"
            name="search"
            placeholder="Search by name, phone, or booking ID"
            className="filter-input"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <select
          name="status"
          className="filter-select"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="New Booking">New Booking</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Arrived">Arrived</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          name="startDate"
          className="filter-select"
          value={filters.startDate}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="endDate"
          className="filter-select"
          value={filters.endDate}
          onChange={handleFilterChange}
        />

        <button className="btn btn-outline btn-small" onClick={() => setFilters({ search: '', status: '', startDate: '', endDate: '' })}>
          Clear Filters
        </button>
      </div>

      {/* Results Count */}
      <div className="results-info">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header" onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}>
                <div className="booking-summary">
                  <p className="booking-id">{booking.bookingId}</p>
                  <p className="customer-name">{booking.customerName}</p>
                  <p className="booking-dates">
                    {new Date(booking.arrivalDate).toLocaleDateString('en-IN')} - {new Date(booking.departureDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="booking-meta">
                  <div className="amount">₹ {booking.totalPackageAmount?.toLocaleString('en-IN')}</div>
                  <span className={`status-badge ${getStatusClass(booking.bookingStatus)}`}>
                    {booking.bookingStatus}
                  </span>
                  <button className="expand-btn">
                    {expandedId === booking._id ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>
              </div>

              {expandedId === booking._id && (
                <div className="booking-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Package</span>
                      <span className="detail-value">{booking.packageName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{booking.phoneNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Hotel</span>
                      <span className="detail-value">{booking.hotelName || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Status</span>
                      <span className="detail-value">{booking.paymentStatus}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Advance</span>
                      <span className="detail-value">₹ {booking.advancePayment?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Remaining</span>
                      <span className="detail-value">₹ {booking.remainingPayment?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {booking.specialNotes && (
                    <div className="notes-section">
                      <strong>Special Notes:</strong> {booking.specialNotes}
                    </div>
                  )}

                  <div className="action-buttons">
                    <button className="action-btn view-btn" title="View Details">
                      <FiEye size={18} /> View
                    </button>
                    <Link to={`/bookings/${booking._id}/edit`} className="action-btn edit-btn">
                      <FiEdit2 size={18} /> Edit
                    </Link>
                    <button className="action-btn whatsapp-btn" onClick={() => openWhatsApp(booking)}>
                      <FiMessageCircle size={18} /> WhatsApp
                    </button>
                    <button className="action-btn download-btn" onClick={() => handleDownload(booking)}>
                      <FiDownload size={18} /> Download
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(booking._id)}>
                      <FiTrash2 size={18} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No bookings found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusClass(status) {
  const classMap = {
    'New Booking': 'new',
    'Confirmed': 'confirmed',
    'Arrived': 'arrived',
    'In Progress': 'in-progress',
    'Completed': 'completed',
    'Cancelled': 'cancelled'
  };
  return classMap[status] || 'new';
}

export default AllBookings;
