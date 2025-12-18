const Admin = require('../models/Admin');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Login
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  // Simple check (In production, use bcrypt to compare hashed passwords)
  if (username === 'admin' && password === 'admin123') {
      const payload = { user: { id: 'admin_id' } };
      jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        { expiresIn: '4h' }, 
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
  } else {
      return res.status(400).json({ message: 'Invalid Credentials' });
  }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: 'Student removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};