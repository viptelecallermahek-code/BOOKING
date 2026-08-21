const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    default: () => 'GOA' + new Date().getFullYear() + String(Date.now()).slice(-8)
  },
  // Customer Details
  customerName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  whatsappNumber: String,
  email: String,
  numberOfAdults: {
    type: Number,
    default: 1
  },
  numberOfChildren: {
    type: Number,
    default: 0
  },
  cityState: String,

  // Travel Details
  arrivalDate: {
    type: Date,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  arrivalTime: String,
  pickupLocation: String,
  hotelName: String,

  // Package Details
  packageName: {
    type: String,
    required: true
  },
  packageType: String,
  selectedActivities: [String],
  numberOfPeople: Number,
  totalPackageAmount: {
    type: Number,
    required: true
  },
  advancePayment: {
    type: Number,
    default: 0
  },
  remainingPayment: Number,
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Partial', 'Pending'],
    default: 'Pending'
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Other'],
    default: 'Cash'
  },

  // Booking Status
  bookingStatus: {
    type: String,
    enum: ['New Booking', 'Confirmed', 'Arrived', 'In Progress', 'Completed', 'Cancelled'],
    default: 'New Booking'
  },

  // Additional Information
  specialNotes: String,
  customerRequirements: String,
  internalNotes: String,

  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

// Middleware to calculate remaining payment
bookingSchema.pre('save', function(next) {
  if (this.totalPackageAmount && this.advancePayment) {
    this.remainingPayment = this.totalPackageAmount - this.advancePayment;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
