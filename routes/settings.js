const express = require('express');
const User = require('../models/User');
const authRouter = require('./auth');
const verifyToken = authRouter.verifyToken;
const router = express.Router();

// Get Current User Settings
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// Update User Settings
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// Change Password
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.userId);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

// Admin: Get All Users (Admin only)
router.get('/users/all', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const users = await User.find().select('-password');
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Admin: Create New User (Admin only)
router.post('/users/create', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { name, email, password, phone, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      phone,
      role: role || 'staff'
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Admin: Delete User (Admin only)
router.delete('/users/:id', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Get Application Settings
router.get('/app-config', verifyToken, async (req, res) => {
  try {
    const config = {
      appName: 'Goa Package Manager',
      version: '1.0.0',
      businessName: 'Your Business Name',
      businessPhone: '+91-XXXXXXXXXX',
      businessEmail: 'info@goapackages.com',
      whatsappNumber: '+91-XXXXXXXXXX',
      features: {
        whatsappIntegration: true,
        reports: true,
        exportData: true,
        calendarView: true,
        paymentTracking: true
      }
    };
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching app config', error: error.message });
  }
});

module.exports = router;
