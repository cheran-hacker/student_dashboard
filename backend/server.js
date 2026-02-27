const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/students', require('./routes/studentRoutes')); // Student CRUD
app.use('/api/admin', require('./routes/adminRoutes'));     // Admin routes
app.use('/api/config', require('./routes/configRoutes'));   // Maintenance Mode

const PORT = process.env.PORT || 5001;

// Database Connection and Server Start
const startServer = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/educrm');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Start server only after DB connection
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 API URL: http://127.0.0.1:${PORT}/api`);
    });

    // Handle port already in use error
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.log('\n💡 Solutions:');
        console.log(`   1. Kill the process using port ${PORT}:`);
        console.log(`      Windows: netstat -ano | findstr :${PORT}`);
        console.log(`      Then: taskkill /PID <PID> /F`);
        console.log(`   2. Or use a different port by setting PORT environment variable`);
        console.log(`      Example: PORT=5001 node server.js`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();

