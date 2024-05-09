const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            
        });
        console.log("CONNECTED TO DATABASE SUCCESSFULLY"); //removed UseUnified/parser due to errors about getting removed in upcoming version
    } catch (err) {
        console.error('COULD NOT CONNECT TO DATABASE:', err);
    }
}

module.exports = connectDB

