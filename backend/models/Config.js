const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'maintenance_mode'
  value: { type: Boolean, default: false }
});

module.exports = mongoose.model('Config', ConfigSchema);