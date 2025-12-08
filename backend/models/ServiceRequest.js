const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  serviceType: { type: String, required: true }, // e.g., 'Plumbing', 'Electrical'
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'In-progress', 'Completed', 'Rejected'], 
    default: 'Pending' 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  studentName: { type: String }, // Storing name/room for easier display without population
  room: { type: String },
  requestedDate: { type: Date, default: Date.now },
  scheduledDate: { type: Date }
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);