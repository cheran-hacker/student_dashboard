const express = require('express');
const router = express.Router();
const { getMaintenanceStatus, toggleMaintenance } = require('../controllers/configController');
const auth = require('../middleware/authMiddleware');

// Get Status (Public endpoint for checking status)
router.get('/maintenance', getMaintenanceStatus);

// Also support /config endpoint for backward compatibility
router.get('/', getMaintenanceStatus);

// Toggle Status (Protected - requires admin auth)
router.post('/maintenance', auth, toggleMaintenance);
router.put('/', auth, toggleMaintenance); // Support PUT for compatibility

module.exports = router;