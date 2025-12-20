const express = require('express');
const router = express.Router();
const { registerStudent } = require('../controllers/studentController');
const Student = require('../models/Student');

// Get All
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

// Register (Create) - Use controller for maintenance mode check
router.post('/register', registerStudent);

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updated);
  } catch (err) { 
    res.status(500).json({ message: 'Server Error: ' + err.message }); 
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) { res.status(500).json({ message: 'Server Error: ' + err.message }); }
});

module.exports = router;