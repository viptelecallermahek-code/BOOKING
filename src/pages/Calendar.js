import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AuthContext } from '../App';
import '../styles/Calendar.css';

function Calendar() {
  const { API_URL, token } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [selectedDateBookings, setSelectedDateBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.bookings);
    } catch (error) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    
    // Get all bookings for the selected date
    const dateStr = selectedDate.toDateString();
    const bookingsForDate = bookings.filter(b => {
      const arrivalStr = new Date(b.arrivalDate).toDateString();
      const departureStr = new Date(b.departureDate).toDateString();
      
      // Check if selected date is between arrival and departure (inclusive)
      return selectedDate >= new Date(b.arrivalDate) && selectedDate <= new Date(b.departureDate);
    });
    
    setSelectedDateBookings(bookingsForDate);
  };

  const getDateClass = (date) => {
    const dateStr = date.toDateString();
    
    // Check if today
    if (dateStr === new Date().toDateString()) {
      return 'calendar-today';
    }
    
    // Check if has bookings
    const hasBookings = bookings.some(b => {
      return date >= new Date(b.arrivalDate) && date <= new Date(b.departureDate);
    });
    
    return hasBookings ? 'calendar-has-bookings' : '';
  };

  if (loading) return <div className="loading">Loading calendar...</div>;

  return (
    <div className="calendar-container">
      <div className="page-header">
        <h1>Booking Calendar</h1>
        <p>View all bookings and customer arrivals by date</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="calendar-layout">
        {/* Calendar */}
        <div className="calendar-section">
          <div className="calendar-wrapper">
            <ReactCalendar
              onChange={handleDateChange}
              value={date}
              tileClassName={({ date }) => getDateClass(date)}
            />
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color today"></div>
              <span>Today</span>
            </div>
            <div className="legend-item">
              <div className="legend-color has-bookings"></div>
              <span>Has Bookings</span>
            </div>
          </div>
        </div>

        {/* Bookings for Selected Date */}
        <div className="bookings-section">
          <div className="bookings-header">
            <h2>Bookings for {date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
            <p className="booking-count">{selectedDateBookings.length} booking(s)</p>
          </div>

          {selectedDateBookings.length > 0 ? (
            <div className="bookings-list">
              {selectedDateBookings.map((booking) => {
                const isArrival = new Date(booking.arrivalDate).toDateString() === date.toDateString();
                const isDeparture = new Date(booking.departureDate).toDateString() === date.toDateString();
                
                return (
                  <div key={booking._id} className={`booking-item ${isArrival ? 'arrival' : ''} ${isDeparture ? 'departure' : ''}`}>
                    <div className="booking-badge">
                      {isArrival && <span className="badge-arrival">ARRIVAL</span>}
                      {isDeparture && <span className="badge-departure">DEPARTURE</span>}
                      {!isArrival && !isDeparture && <span className="badge-staying">STAYING</span>}
                    </div>

                    <div className="booking-content">
                      <h3>{booking.customerName}</h3>
                      <p className="booking-package">{booking.packageName}</p>
                      
                      <div className="booking-info-grid">
                        <div className="info-item">
                          <span className="info-label">Phone</span>
                          <span className="info-value">{booking.phoneNumber}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Hotel</span>
                          <span className="info-value">{booking.hotelName || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">People</span>
                          <span className="info-value">{booking.numberOfAdults + booking.numberOfChildren}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Amount</span>
                          <span className="info-value">₹{booking.totalPackageAmount?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="booking-status">
                        <span className={`status-badge ${getStatusClass(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
                        </span>
                        <span className={`payment-badge ${getPaymentClass(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>

                      {booking.specialNotes && (
                        <div className="booking-notes">
                          <strong>Notes:</strong> {booking.specialNotes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-bookings">
              <p>No bookings for this date</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="monthly-summary">
        <h3>Monthly Summary - {date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <p className="summary-label">Total Bookings</p>
            <p className="summary-value">
              {bookings.filter(b => {
                const bookingMonth = new Date(b.arrivalDate).getMonth();
                const bookingYear = new Date(b.arrivalDate).getFullYear();
                return bookingMonth === date.getMonth() && bookingYear === date.getFullYear();
              }).length}
            </p>
          </div>
          <div className="summary-card">
            <p className="summary-label">Total Revenue</p>
            <p className="summary-value">
              ₹ {bookings
                .filter(b => {
                  const bookingMonth = new Date(b.arrivalDate).getMonth();
                  const bookingYear = new Date(b.arrivalDate).getFullYear();
                  return bookingMonth === date.getMonth() && bookingYear === date.getFullYear();
                })
                .reduce((sum, b) => sum + (b.totalPackageAmount || 0), 0)
                .toLocaleString('en-IN')}
            </p>
          </div>
          <div className="summary-card">
            <p className="summary-label">Arrivals</p>
            <p className="summary-value">
              {bookings.filter(b => {
                const arrivalMonth = new Date(b.arrivalDate).getMonth();
                const arrivalYear = new Date(b.arrivalDate).getFullYear();
                return arrivalMonth === date.getMonth() && arrivalYear === date.getFullYear();
              }).length}
            </p>
          </div>
          <div className="summary-card">
            <p className="summary-label">Departures</p>
            <p className="summary-value">
              {bookings.filter(b => {
                const departureMonth = new Date(b.departureDate).getMonth();
                const departureYear = new Date(b.departureDate).getFullYear();
                return departureMonth === date.getMonth() && departureYear === date.getFullYear();
              }).length}
            </p>
          </div>
        </div>
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

function getPaymentClass(status) {
  const classMap = {
    'Paid': 'paid',
    'Partial': 'partial',
    'Pending': 'pending'
  };
  return classMap[status] || 'pending';
}

export default Calendar;
