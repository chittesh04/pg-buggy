const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

// REPLACE with your connection string if not using .env
const MONGO_URI = 'mongodb+srv://chittesh04:chittesh04@cluster0.d2ilo1g.mongodb.net/hostel_db?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');

    // Clear existing users
    await User.deleteMany({});

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const userPass = await bcrypt.hash('user123', salt);

    // Create Users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@hostel.com',
        password: adminPass,
        role: 'Admin',
        isStudent: false
      },
      {
        name: 'John Doe',
        email: 'john@hostel.com',
        password: userPass,
        role: 'User',
        room: '101',
        isStudent: true
      }
    ];

    await User.insertMany(users);
    console.log('Data Seeded! You can now login with:');
    console.log('Admin: admin@hostel.com / admin123');
    console.log('User: john@hostel.com / user123');
    process.exit();
  })
  .catch(err => console.log(err));