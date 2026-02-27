const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log('MONGO_URI loaded:', process.env.MONGO_URI ? 'Yes (length: ' + process.env.MONGO_URI.length + ')' : 'No');
process.exit(0);
