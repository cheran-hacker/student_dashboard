const Student = require('../models/Student');
const Config = require('../models/Config');

exports.registerStudent = async (req, res) => {
  try {
    console.log("1. Received Registration Request:", req.body.email);

    // Check Config
    try {
      const config = await Config.findOne({ key: 'maintenance_mode' });
      if (config && config.value === true) {
        return res.status(503).json({ message: 'Maintenance Mode ON' });
      }
    } catch (configErr) {
      console.warn("Warning: Could not check maintenance mode:", configErr.message);
      // Proceed even if config check fails
    }

    // Normalize register number to uppercase for consistency
    if (req.body.registerNumber) {
      req.body.registerNumber = req.body.registerNumber.trim().toUpperCase();
    }

    // Normalize email to lowercase
    if (req.body.email) {
      req.body.email = req.body.email.trim().toLowerCase();
    }

    // Check for duplicates
    const existingStudent = await Student.findOne({
      $or: [
        { email: req.body.email },
        { registerNumber: req.body.registerNumber }
      ]
    });

    if (existingStudent) {
      console.log("2. Duplicate found");
      const duplicateField = existingStudent.email === req.body.email ? 'email' : 'register number';
      return res.status(400).json({
        message: `Student with this ${duplicateField} already exists`
      });
    }

    // Create and Save
    const student = new Student(req.body);
    console.log("3. Attempting to save to MongoDB...");

    await student.save();

    console.log("4. Saved successfully");
    // MUST SEND RESPONSE
    return res.status(201).json({ message: 'Student registered successfully' });

  } catch (err) {
    console.error("X. SERVER ERROR:", err.message);

    // Handle duplicate key error (MongoDB unique constraint)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        message: `Student with this ${field === 'email' ? 'email address' : 'register number'} already exists`
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        message: 'Validation Error',
        errors: errors
      });
    }

    // Generic server error
    return res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};