const express = require('express');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to protect all student routes
router.use(authMiddleware);

// Get all students (with optional search query)
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { rollNumber: { $regex: q, $options: 'i' } },
          { course: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
        ],
      };
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Get a single student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
});

// Create a new student
router.post('/', async (req, res) => {
  try {
    const { name, rollNumber, email, course, phone } = req.body;

    if (!name || !rollNumber || !email || !course || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingRoll = await Student.findOne({ rollNumber: rollNumber.trim() });
    if (existingRoll) {
      return res.status(400).json({ message: 'Student with this Roll Number already exists.' });
    }

    const student = new Student({
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      email: email.trim(),
      course: course.trim(),
      phone: phone.trim(),
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
});

// Update student by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, rollNumber, email, course, phone } = req.body;

    if (!name || !rollNumber || !email || !course || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if another student has the same roll number
    const existing = await Student.findOne({
      rollNumber: rollNumber.trim(),
      _id: { $ne: req.params.id },
    });

    if (existing) {
      return res.status(400).json({ message: 'Another student already uses this Roll Number.' });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        rollNumber: rollNumber.trim(),
        email: email.trim(),
        course: course.trim(),
        phone: phone.trim(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
});

// Delete student by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json({ message: 'Student deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

module.exports = router;
