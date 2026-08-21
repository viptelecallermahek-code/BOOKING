const express = require('express');
const Booking = require('../models/Booking');
const authRouter = require('./auth');
const verifyToken = authRouter.verifyToken;
const router = express.Router();

// Get All Unique Customers
router.get('/all', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ isDeleted: false })
      .sort({ createdAt: -1 });

    // Group by phone number to get unique customers
    const customersMap = new Map();

    bookings.forEach(booking => {
      if (!customersMap.has(booking.phoneNumber)) {
        customersMap.set(booking.phoneNumber, {
          customerName: booking.customerName,
          phoneNumber: booking.phoneNumber,
          whatsappNumber: booking.whatsappNumber,
          email: booking.email,
          cityState: booking.cityState,
          totalBookings: 0,
          totalSpent: 0,
          lastBookingDate: null,
          bookings: []
        });
      }
      const customer = customersMap.get(booking.phoneNumber);
      customer.totalBookings += 1;
      customer.totalSpent += booking.totalPackageAmount || 0;
      customer.lastBookingDate = booking.arrivalDate > (customer.lastBookingDate || new Date(0)) 
        ? booking.arrivalDate 
        : customer.lastBookingDate;
      customer.bookings.push(booking._id);
    });

    const customers = Array.from(customersMap.values());

    res.json({
      count: customers.length,
      customers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
});

// Get Customer by Phone
router.get('/phone/:phone', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      phoneNumber: req.params.phone,
      isDeleted: false
    }).sort({ createdAt: -1 });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const firstBooking = bookings[0];
    const customer = {
      customerName: firstBooking.customerName,
      phoneNumber: firstBooking.phoneNumber,
      whatsappNumber: firstBooking.whatsappNumber,
      email: firstBooking.email,
      cityState: firstBooking.cityState,
      numberOfAdults: firstBooking.numberOfAdults,
      numberOfChildren: firstBooking.numberOfChildren,
      totalBookings: bookings.length,
      totalSpent: bookings.reduce((sum, b) => sum + (b.totalPackageAmount || 0), 0),
      lastBookingDate: bookings[0].arrivalDate,
      bookingHistory: bookings
    };

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error: error.message });
  }
});

// Search Customers
router.get('/search/:query', verifyToken, async (req, res) => {
  try {
    const { query } = req.params;
    
    const bookings = await Booking.find({
      $or: [
        { customerName: { $regex: query, $options: 'i' } },
        { phoneNumber: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      isDeleted: false
    });

    const customersMap = new Map();
    bookings.forEach(booking => {
      if (!customersMap.has(booking.phoneNumber)) {
        customersMap.set(booking.phoneNumber, {
          customerName: booking.customerName,
          phoneNumber: booking.phoneNumber,
          whatsappNumber: booking.whatsappNumber,
          email: booking.email,
          totalBookings: 0,
          totalSpent: 0
        });
      }
      const customer = customersMap.get(booking.phoneNumber);
      customer.totalBookings += 1;
      customer.totalSpent += booking.totalPackageAmount || 0;
    });

    const customers = Array.from(customersMap.values());

    res.json({
      count: customers.length,
      customers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching customers', error: error.message });
  }
});

module.exports = router;
