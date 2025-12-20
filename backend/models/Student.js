const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  registerNumber: { 
    type: String, 
    required: [true, 'Register Number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  department: { 
    type: String, 
    required: [true, 'Department is required'],
    trim: true
  },
  year: { 
    type: String, 
    required: [true, 'Year is required'],
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
  },
  accommodationType: { 
    type: String, 
    default: 'Day Scholar',
    enum: ['Day Scholar', 'Hosteler']
  },
  technologiesKnown: { 
    type: [String], 
    default: [] 
  },
  
  // Placement Fields
  placementStatus: { 
    type: String, 
    default: 'Unplaced',
    enum: ['Unplaced', 'Placed', 'Higher Studies', 'Entrepreneur']
  },
  company: { 
    type: String, 
    default: '',
    trim: true
  },
  ctc: { 
    type: Number, 
    default: 0,
    min: [0, 'CTC must be a positive number']
  },
  
  // Academic Fields
  cgpa: { 
    type: Number, 
    default: 0,
    min: [0, 'CGPA must be between 0 and 10'],
    max: [10, 'CGPA must be between 0 and 10']
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);