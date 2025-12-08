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

// Routes (We will create these next)
app.use('/api/complaints', require('./routes/complaintRoutes'));
// app.use('/api/users', require('./routes/userRoutes')); 
const emptyRoute = (req, res) => res.json([]); 
app.get('/api/users', emptyRoute);
app.get('/api/service-requests', emptyRoute);
app.get('/api/leave-requests', emptyRoute);
app.get('/api/payments', emptyRoute);
app.get('/api/announcements', emptyRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));