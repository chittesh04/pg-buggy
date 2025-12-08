const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');

// GET all service requests
router.get('/', async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort({ requestedDate: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new service request
router.post('/', async (req, res) => {
  // Note: In a real app, we would get studentId from the logged-in session
  // For now, we expect it in req.body or we create the object directly
  const request = new ServiceRequest(req.body);
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
    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
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