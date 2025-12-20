const Config = require('../models/Config');

// @desc    Get Maintenance Status
// @route   GET /api/config/maintenance
exports.getMaintenanceStatus = async (req, res) => {
  try {
    let config = await Config.findOne({ key: 'maintenance_mode' });
    if (!config) {
      config = await Config.create({ key: 'maintenance_mode', value: false });
    }
    res.json({ maintenanceMode: config.value });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle Maintenance Mode
// @route   POST /api/config/maintenance or PUT /api/config
exports.toggleMaintenance = async (req, res) => {
  try {
    const { value, maintenanceMode } = req.body; // Support both field names
    const newValue = value !== undefined ? value : (maintenanceMode !== undefined ? maintenanceMode : false);
    let config = await Config.findOneAndUpdate(
      { key: 'maintenance_mode' },
      { value: newValue },
      { new: true, upsert: true }
    );
    res.json({ maintenanceMode: config.value });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};