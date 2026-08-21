const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const authRouter = require('./auth');
const verifyToken = authRouter.verifyToken;
const router = express.Router();

// Create New Booking
router.post('/create', verifyToken, [
  body('customerName').notEmpty(),
  body('phoneNumber').notEmpty(),
  body('arrivalDate').notEmpty(),
  body('departureDate').notEmpty(),
  body('packageName').notEmpty(),
  body('totalPackageAmount').isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bookingData = req.body;
    
    // Calculate number of days
    const arrival = new Date(bookingData.arrivalDate);
    const departure = new Date(bookingData.departureDate);
    const numberOfDays = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));

    const booking = new Booking({
      ...bookingData,
      numberOfDays,
      createdBy: req.userId
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Get All Bookings
router.get('/all', verifyToken, async (req, res) => {
  try {
    const { status, startDate, endDate, search } = req.query;
    
    let filter = { isDeleted: false };

    if (status) filter.bookingStatus = status;
    
    if (startDate || endDate) {
      filter.arrivalDate = {};
      if (startDate) filter.arrivalDate.$gte = new Date(startDate);
      if (endDate) filter.arrivalDate.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Get Single Booking
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!booking || booking.isDeleted) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
});

// Update Booking
router.put('/:id', verifyToken, async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking || booking.isDeleted) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Recalculate number of days if dates changed
    if (req.body.arrivalDate || req.body.departureDate) {
      const arrival = new Date(req.body.arrivalDate || booking.arrivalDate);
      const departure = new Date(req.body.departureDate || booking.departureDate);
      req.body.numberOfDays = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name email');

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

// Delete Booking (Soft Delete)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
});

// Get Today's Arrivals
router.get('/stats/today-arrivals', verifyToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookings = await Booking.find({
      arrivalDate: { $gte: today, $lt: tomorrow },
      isDeleted: false,
      bookingStatus: { $in: ['Confirmed', 'Arrived'] }
    });

    res.json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today arrivals', error: error.message });
  }
});

// Get Upcoming Arrivals
router.get('/stats/upcoming-arrivals', verifyToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const bookings = await Booking.find({
      arrivalDate: { $gte: today, $lt: nextWeek },
      isDeleted: false,
      bookingStatus: { $ne: 'Cancelled' }
    }).sort({ arrivalDate: 1 });

    res.json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming arrivals', error: error.message });
  }
});

// Get Bookings by Date Range
router.get('/range/:startDate/:endDate', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    
    const bookings = await Booking.find({
      arrivalDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      isDeleted: false
    }).sort({ arrivalDate: 1 });

    res.json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

module.exports = router;
