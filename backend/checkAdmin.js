require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
        console.log('Connected to MongoDB');

        const admins = await Admin.find({});
        if (admins.length === 0) {
            console.log('No admin found. Creating default admin...');
            await Admin.create({ username: 'admin', password: 'admin123' });
            console.log('✅ Admin created: username=admin | password=admin123');
        } else {
            console.log('Existing admin accounts:');
            admins.forEach(a => {
                console.log(`  username: ${a.username} | password: ${a.password}`);
            });
        }
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

main();
