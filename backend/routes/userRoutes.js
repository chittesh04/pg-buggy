const express = require('express');
const router = express.Router();
const User = require('../models/user');


// Import dependent models
const Complaint = require('../models/Complaint');
const ServiceRequest = require('../models/ServiceRequest');
const LeaveRequest = require('../models/LeaveRequest');
const Payment = require('../models/Payment');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a user AND their associated data
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // 1. Delete all associated data first (Parallel execution for speed)
    await Promise.all([
      Complaint.deleteMany({ student: userId }),
      ServiceRequest.deleteMany({ student: userId }),
      LeaveRequest.deleteMany({ student: userId }),
      Payment.deleteMany({ student: userId })
    ]);

    // 2. Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;