const Config = require('../models/Config');

// Get Status (Public - for Student Page)
exports.getConfig = async (req, res) => {
  try {
    // Find the first config document. If none exists, create one.
    let config = await Config.findOne();
    if (!config) {
      config = new Config({ maintenanceMode: false });
      await config.save();
    }
    res.json(config);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update Status (Protected - for Admin)
exports.updateConfig = async (req, res) => {
  try {
    const { maintenanceMode } = req.body;
    // Update the single config document using upsert (update or insert)
    const config = await Config.findOneAndUpdate(
      {}, 
      { maintenanceMode }, 
      { new: true, upsert: true }
    );
    res.json(config);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};