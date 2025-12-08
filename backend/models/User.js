const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will store hashed password later
  role: { 
    type: String, 
    enum: ['Admin', 'User'], 
    default: 'User' 
  },
  room: { type: String, required: function() { return this.role === 'User'; } }, // Room required only for students
  contact: { type: String },
  isStudent: { type: Boolean, default: true },
  joinDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
});

module.exports = mongoose.model('User', UserSchema);