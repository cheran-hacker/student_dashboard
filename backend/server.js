const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors
require('dotenv').config();

const app = express();

// 1. Connect to Database
connectDB();

// 2. ENABLE CORS (The Fix)
app.use(cors({ origin: '*' })); 
app.use(express.json());

// 3. Routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/config', require('./routes/configRoutes'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));