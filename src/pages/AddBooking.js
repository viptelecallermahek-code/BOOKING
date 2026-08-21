import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { AuthContext } from '../App';
import '../styles/AddBooking.css';

function AddBooking() {
  const { API_URL, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    numberOfAdults: 1,
    numberOfChildren: 0,
    cityState: '',
    arrivalDate: '',
    departureDate: '',
    arrivalTime: '',
    pickupLocation: '',
    hotelName: '',
    packageName: '',
    packageType: '',
    selectedActivities: [],
    numberOfPeople: 1,
    totalPackageAmount: 0,
    advancePayment: 0,
    paymentStatus: 'Pending',
    paymentMode: 'Cash',
    bookingStatus: 'New Booking',
    specialNotes: '',
    customerRequirements: '',
    internalNotes: ''
  });

  const packageTypes = [
    'Scuba Diving',
    'Water Sports',
    'Beach Holiday',
    'Cultural Tour',
    'Adventure Tour',
    'Honeymoon Package',
    'Family Package',
    'Corporate Retreat',
    'Other'
  ];

  const activities = [
    'Scuba Diving',
    'Snorkeling',
    'Jet Ski',
    'Parasailing',
    'Island Hopping',
    'Beach Volleyball',
    'Sunset Cruise',
    'Spa Treatment',
    'Houseboat Ride',
    'Fort Visit',
    'Spice Plantation Tour',
    'Kayaking'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleActivityToggle = (activity) => {
    setFormData(prev => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(activity)
        ? prev.selectedActivities.filter(a => a !== activity)
        : [...prev.selectedActivities, activity]
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleMoneyChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.customerName || !formData.phoneNumber || !formData.arrivalDate || !formData.departureDate) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (new Date(formData.departureDate) <= new Date(formData.arrivalDate)) {
      setError('Departure date must be after arrival date');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/bookings/create`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Booking created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/bookings');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-booking">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} /> Back
        </button>
        <div>
          <h1>Add New Booking</h1>
          <p>Enter customer and package details to create a new booking</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <FiAlertCircle size={20} />
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <FiCheck size={20} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Customer Details */}
        <div className="form-section">
          <h2>Customer Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Customer Name</label>
              <input
                type="text"
                name="customerName"
                className="form-input"
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                className="form-input"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input
                type="tel"
                name="whatsappNumber"
                className="form-input"
                placeholder="Enter WhatsApp number (optional)"
                value={formData.whatsappNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email ID</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">City / State</label>
              <input
                type="text"
                name="cityState"
                className="form-input"
                placeholder="Enter city/state"
                value={formData.cityState}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Number of Adults</label>
              <input
                type="number"
                name="numberOfAdults"
                className="form-input"
                min="1"
                value={formData.numberOfAdults}
                onChange={handleNumberChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Number of Children</label>
              <input
                type="number"
                name="numberOfChildren"
                className="form-input"
                min="0"
                value={formData.numberOfChildren}
                onChange={handleNumberChange}
              />
            </div>
          </div>
        </div>

        {/* Travel Details */}
        <div className="form-section">
          <h2>Travel Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Arrival Date</label>
              <input
                type="date"
                name="arrivalDate"
                className="form-input"
                value={formData.arrivalDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Departure Date</label>
              <input
                type="date"
                name="departureDate"
                className="form-input"
                value={formData.departureDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Arrival Time</label>
              <input
                type="time"
                name="arrivalTime"
                className="form-input"
                value={formData.arrivalTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pickup Location</label>
              <input
                type="text"
                name="pickupLocation"
                className="form-input"
                placeholder="Enter pickup location"
                value={formData.pickupLocation}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hotel Name / Stay Location</label>
              <input
                type="text"
                name="hotelName"
                className="form-input"
                placeholder="Enter hotel or stay location"
                value={formData.hotelName}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="form-section">
          <h2>Package Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Package Name</label>
              <input
                type="text"
                name="packageName"
                className="form-input"
                placeholder="Enter package name"
                value={formData.packageName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Package Type</label>
              <select
                name="packageType"
                className="form-input"
                value={formData.packageType}
                onChange={handleChange}
              >
                <option value="">Select package type</option>
                {packageTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Number of People</label>
              <input
                type="number"
                name="numberOfPeople"
                className="form-input"
                min="1"
                value={formData.numberOfPeople}
                onChange={handleNumberChange}
              />
            </div>
          </div>

          {/* Activities */}
          <div className="form-group">
            <label className="form-label">Selected Activities / Services</label>
            <div className="activities-grid">
              {activities.map(activity => (
                <label key={activity} className="activity-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.selectedActivities.includes(activity)}
                    onChange={() => handleActivityToggle(activity)}
                  />
                  <span>{activity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="form-section">
          <h2>Payment Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Total Package Amount (₹)</label>
              <input
                type="number"
                name="totalPackageAmount"
                className="form-input"
                placeholder="0"
                value={formData.totalPackageAmount}
                onChange={handleMoneyChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Advance Payment (₹)</label>
              <input
                type="number"
                name="advancePayment"
                className="form-input"
                placeholder="0"
                value={formData.advancePayment}
                onChange={handleMoneyChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Remaining Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Auto-calculated"
                value={formData.totalPackageAmount - formData.advancePayment}
                disabled
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Status</label>
              <select
                name="paymentStatus"
                className="form-input"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select
                name="paymentMode"
                className="form-input"
                value={formData.paymentMode}
                onChange={handleChange}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Booking Status</label>
              <select
                name="bookingStatus"
                className="form-input"
                value={formData.bookingStatus}
                onChange={handleChange}
              >
                <option value="New Booking">New Booking</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Arrived">Arrived</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label className="form-label">Special Notes</label>
            <textarea
              name="specialNotes"
              className="form-textarea"
              placeholder="Any special requirements or notes"
              value={formData.specialNotes}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Customer Requirements</label>
            <textarea
              name="customerRequirements"
              className="form-textarea"
              placeholder="Specific customer requirements"
              value={formData.customerRequirements}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Internal Staff Notes</label>
            <textarea
              name="internalNotes"
              className="form-textarea"
              placeholder="Internal notes for staff (not visible to customer)"
              value={formData.internalNotes}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Booking...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBooking;
