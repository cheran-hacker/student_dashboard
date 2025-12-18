const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  // 'unique: true' creates a database index
  // This makes checking for duplicates instant (0.01s instead of 2.0s)
  registerNumber: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  year: { type: String, required: true },
  department: { type: String, required: true },
  accommodationType: { type: String, required: true, enum: ['Day Scholar', 'Hosteler'] },
  technologiesKnown: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);