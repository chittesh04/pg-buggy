// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// REPLACE 'your_connection_string' with your actual MongoDB URI
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://chittesh04:chittesh04@cluster0.d2ilo1g.mongodb.net/?appName=Cluster0')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes

// Routes
app.use('/api/auth', require('./routes/authRoutes')); // <--- ADD THIS LINE
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/service-requests', require('./routes/serviceRequestRoutes'));
app.use('/api/leave-requests', require('./routes/leaveRequestRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));