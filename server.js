// server.js

require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const fs = require('fs');

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Define route handler for the root URL
app.get('/', (req, res) => {
    res.send('Hello, World!'); // Send a response to the client
});

// Middleware
app.use(express.json());

// Read the JSON file
fs.readFile('./model/statesData.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        // Parse the JSON data into a JavaScript object
        const statesData = JSON.parse(data);

        // Now you can use the statesData object in your application
        console.log(statesData);
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});

// Use states routes
app.use('/states', require('./routes/states'));

// Start the server
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
