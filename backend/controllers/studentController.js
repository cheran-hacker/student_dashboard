const Student = require('../models/Student');
const Config = require('../models/Config');

exports.registerStudent = async (req, res) => {
  try {
    console.log("1. Received Registration Request:", req.body.email);

    // Check Config
    const config = await Config.findOne({ key: 'maintenance_mode' });
    if (config && config.value === true) {
      return res.status(503).json({ message: 'Maintenance Mode ON' });
    }

    // Check for duplicates
    const existingStudent = await Student.findOne({ 
      $or: [{ email: req.body.email }, { registerNumber: req.body.registerNumber }] 
    });
    
    if (existingStudent) {
      console.log("2. Duplicate found");
      return res.status(400).json({ message: 'Student already exists' });
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
    // This catch block handles connection timeouts or validation errors
    return res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};