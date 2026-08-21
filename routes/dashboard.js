const express = require('express');
const Booking = require('../models/Booking');
const authRouter = require('./auth');
const verifyToken = authRouter.verifyToken;
const router = express.Router();

// Get Dashboard Stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total Bookings
    const totalBookings = await Booking.countDocuments({ isDeleted: false });

    // Today's Arrivals
    const todayArrivals = await Booking.countDocuments({
      arrivalDate: { $gte: today, $lt: tomorrow },
      isDeleted: false,
      bookingStatus: { $in: ['Confirmed', 'Arrived'] }
    });

    // Upcoming Arrivals (next 7 days)
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingArrivals = await Booking.countDocuments({
      arrivalDate: { $gte: today, $lt: nextWeek },
      isDeleted: false,
      bookingStatus: { $ne: 'Cancelled' }
    });

    // Completed Packages
    const completedPackages = await Booking.countDocuments({
      bookingStatus: 'Completed',
      isDeleted: false
    });

    // Cancelled Bookings
    const cancelledBookings = await Booking.countDocuments({
      bookingStatus: 'Cancelled',
      isDeleted: false
    });

    // Total Customers (unique phone numbers)
    const totalCustomers = await Booking.distinct('phoneNumber', { isDeleted: false });

    // Pending Payments
    const pendingPayments = await Booking.find({
      paymentStatus: { $in: ['Pending', 'Partial'] },
      isDeleted: false
    });

    const totalPendingAmount = pendingPayments.reduce((sum, booking) => 
      sum + (booking.remainingPayment || 0), 0
    );

    // Recent Entries (last 5)
    const recentEntries = await Booking.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5);

    // Total Revenue
    const allBookings = await Booking.find({ isDeleted: false });
    const totalRevenue = allBookings.reduce((sum, booking) => 
      sum + (booking.totalPackageAmount || 0), 0
    );

    res.json({
      totalBookings,
      todayArrivals,
      upcomingArrivals,
      completedPackages,
      cancelledBookings,
      totalCustomers: totalCustomers.length,
      totalRevenue,
      pendingPaymentCount: pendingPayments.length,
      totalPendingAmount,
      recentEntries
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

// Get Revenue Summary
router.get('/revenue/:period', verifyToken, async (req, res) => {
  try {
    const { period } = req.params;
    const today = new Date();
    let startDate;

    switch(period) {
      case 'today':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    const bookings = await Booking.find({
      createdAt: { $gte: startDate },
      isDeleted: false
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPackageAmount || 0), 0);
    const totalAdvance = bookings.reduce((sum, b) => sum + (b.advancePayment || 0), 0);
    const pendingAmount = bookings.reduce((sum, b) => sum + (b.remainingPayment || 0), 0);

    res.json({
      period,
      startDate,
      endDate: new Date(),
      totalRevenue,
      totalAdvance,
      pendingAmount,
      bookingCount: bookings.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue', error: error.message });
  }
});

module.exports = router;
