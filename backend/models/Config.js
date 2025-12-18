const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false } // Default is OFF
});

module.exports = mongoose.model('Config', ConfigSchema);