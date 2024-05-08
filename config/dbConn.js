const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            
        });
        console.log("CONNECTED TO DATABASE SUCCESSFULLY");
    } catch (err) {
        console.error('COULD NOT CONNECT TO DATABASE:', err);
    }
}

module.exports = connectDB

