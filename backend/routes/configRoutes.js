const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/configController');
const auth = require('../middleware/authMiddleware'); // Your existing auth middleware

router.get('/', getConfig);           // Public
router.put('/', auth, updateConfig);  // Protected (Admin only)

module.exports = router;