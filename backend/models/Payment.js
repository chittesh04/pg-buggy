const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Hostel Fee - Nov 2025"
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Overdue'], 
    default: 'Pending' 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  studentName: { type: String },
  room: { type: String },
  paidOn: { type: Date },
  transactionId: { type: String }
});

module.exports = mongoose.model('Payment', PaymentSchema);