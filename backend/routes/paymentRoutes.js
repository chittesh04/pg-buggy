const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// GET all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ dueDate: 1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new payment (Admin creating a fee)
router.post('/', async (req, res) => {
  const payment = new Payment(req.body);
  try {
    const newPayment = await payment.save();
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH (Pay bill or update status)
router.patch('/:id', async (req, res) => {
  try {
    // If we are paying, we might receive paidOn and transactionId
    const updateData = { status: req.body.status };
    if (req.body.paidOn) updateData.paidOn = req.body.paidOn;
    if (req.body.transactionId) updateData.transactionId = req.body.transactionId;

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;