const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// GET all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ date: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new complaint
router.post('/', async (req, res) => {
  const complaint = new Complaint({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    category: req.body.category,
    studentName: req.body.studentName,
    room: req.body.room,
    student: req.body.student 
  });

  try {
    const newComplaint = await complaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH (Update status)
router.patch('/:id', async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedComplaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;