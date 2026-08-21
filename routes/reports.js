const express = require('express');
const Booking = require('../models/Booking');
const authRouter = require('./auth');
const verifyToken = authRouter.verifyToken;
const router = express.Router();

// Daily Report
router.get('/daily/:date', verifyToken, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const bookings = await Booking.find({
      arrivalDate: { $gte: date, $lt: nextDay },
      isDeleted: false
    }).sort({ arrivalDate: 1 });

    const summary = {
      date: date.toDateString(),
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalPackageAmount || 0), 0),
      totalAdvance: bookings.reduce((sum, b) => sum + (b.advancePayment || 0), 0),
      pendingAmount: bookings.reduce((sum, b) => sum + (b.remainingPayment || 0), 0),
      bookingsByStatus: {
        confirmed: bookings.filter(b => b.bookingStatus === 'Confirmed').length,
        arrived: bookings.filter(b => b.bookingStatus === 'Arrived').length,
        completed: bookings.filter(b => b.bookingStatus === 'Completed').length,
        cancelled: bookings.filter(b => b.bookingStatus === 'Cancelled').length
      }
    };

    res.json({ summary, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error generating daily report', error: error.message });
  }
});

// Weekly Report
router.get('/weekly/:startDate', verifyToken, async (req, res) => {
  try {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const bookings = await Booking.find({
      arrivalDate: { $gte: startDate, $lt: endDate },
      isDeleted: false
    }).sort({ arrivalDate: 1 });

    const summary = {
      week: `${startDate.toDateString()} - ${endDate.toDateString()}`,
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalPackageAmount || 0), 0),
      totalAdvance: bookings.reduce((sum, b) => sum + (b.advancePayment || 0), 0),
      pendingAmount: bookings.reduce((sum, b) => sum + (b.remainingPayment || 0), 0),
      totalCustomers: new Set(bookings.map(b => b.phoneNumber)).size,
      paymentStatus: {
        paid: bookings.filter(b => b.paymentStatus === 'Paid').length,
        partial: bookings.filter(b => b.paymentStatus === 'Partial').length,
        pending: bookings.filter(b => b.paymentStatus === 'Pending').length
      }
    };

    res.json({ summary, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error generating weekly report', error: error.message });
  }
});

// Monthly Report
router.get('/monthly/:year/:month', verifyToken, async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const bookings = await Booking.find({
      arrivalDate: { $gte: startDate, $lt: endDate },
      isDeleted: false
    }).sort({ arrivalDate: 1 });

    const summary = {
      month: new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalPackageAmount || 0), 0),
      totalAdvance: bookings.reduce((sum, b) => sum + (b.advancePayment || 0), 0),
      pendingAmount: bookings.reduce((sum, b) => sum + (b.remainingPayment || 0), 0),
      totalCustomers: new Set(bookings.map(b => b.phoneNumber)).size,
      totalPackages: new Set(bookings.map(b => b.packageName)).size,
      paymentStatus: {
        paid: bookings.filter(b => b.paymentStatus === 'Paid').length,
        partial: bookings.filter(b => b.paymentStatus === 'Partial').length,
        pending: bookings.filter(b => b.paymentStatus === 'Pending').length
      }
    };

    res.json({ summary, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error generating monthly report', error: error.message });
  }
});

// Pending Payments Report
router.get('/pending-payments', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      paymentStatus: { $in: ['Pending', 'Partial'] },
      isDeleted: false
    }).sort({ createdAt: -1 });

    const summary = {
      totalPendingBookings: bookings.length,
      totalPendingAmount: bookings.reduce((sum, b) => sum + (b.remainingPayment || 0), 0),
      byPaymentMode: {
        cash: bookings.filter(b => b.paymentMode === 'Cash').length,
        upi: bookings.filter(b => b.paymentMode === 'UPI').length,
        bankTransfer: bookings.filter(b => b.paymentMode === 'Bank Transfer').length,
        other: bookings.filter(b => b.paymentMode === 'Other').length
      }
    };

    res.json({ summary, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error generating pending payments report', error: error.message });
  }
});

// Cancelled Bookings Report
router.get('/cancelled', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      bookingStatus: 'Cancelled',
      isDeleted: false
    }).sort({ updatedAt: -1 });

    const summary = {
      totalCancelled: bookings.length,
      lostRevenue: bookings.reduce((sum, b) => sum + (b.totalPackageAmount || 0), 0),
      refundedAmount: bookings.reduce((sum, b) => sum + (b.advancePayment || 0), 0)
    };

    res.json({ summary, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error generating cancelled bookings report', error: error.message });
  }
});

// Upcoming Customers Report
router.get('/upcoming-customers', verifyToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const bookings = await Booking.find({
      arrivalDate: { $gte: today, $lt: nextMonth },
      isDeleted: false,
      bookingStatus: { $ne: 'Cancelled' }
    }).sort({ arrivalDate: 1 });

    const summary = {
      totalUpcoming: bookings.length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalPackageAmount || 0), 0),
      totalCustomers: new Set(bookings.map(b => b.phoneNumber)).size
    };

    res.json({ summary, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error generating upcoming customers report', error: error.message });
  }
});

module.exports = router;
