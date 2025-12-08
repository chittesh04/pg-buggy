const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In-progress', 'Resolved'], default: 'Pending' },
  category: { type: String, required: true },
  studentName: { type: String, required: true }, // Later this will be a User ID
  room: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);