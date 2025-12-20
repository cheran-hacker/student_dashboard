const Admin = require('../models/Admin');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Login
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Simple check (In production, use bcrypt to compare hashed passwords)
    // Accept both 'admin' and 'admin@educrm.com' as username
    const isValid = (username === 'admin' || username === 'admin@educrm.com') && password === 'admin';
    
    if (isValid) {
      const payload = { user: { id: 'admin_id', username: username } };
      const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      jwt.sign(
        payload, 
        secret, 
        { expiresIn: '4h' }, 
        (err, token) => {
          if (err) {
            console.error('JWT Error:', err);
            return res.status(500).json({ message: 'Error generating token' });
          }
          res.json({ token });
        }
      );
    } else {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server Error: ' + err.message });
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
    const updatedStudent = await Student.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(updatedStudent);
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);
    
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ message: 'Student removed successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};