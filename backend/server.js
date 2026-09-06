const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// Simple Student Management System Server
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_management';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Student Management System API is running smoothly!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Connect to MongoDB & Start Server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Database.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Make sure MongoDB service is running locally or check your MONGO_URI in .env');
    // Start server anyway so API status can be checked
    app.listen(PORT, () => {
      console.log(`Server running with DB warning on http://localhost:${PORT}`);
    });
  });
