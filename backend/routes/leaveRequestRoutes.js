const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');

// GET all leave requests
router.get('/', async (req, res) => {
  try {
    const requests = await LeaveRequest.find().sort({ submissionDate: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new leave request
router.post('/', async (req, res) => {
  const request = new LeaveRequest(req.body);
  try {
    const newRequest = await request.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH (Update status)
router.patch('/:id', async (req, res) => {
  try {
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;