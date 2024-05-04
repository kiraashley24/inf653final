require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Connect to MongoDB
connectDB();

// Apply the CORS middleware
app.use(cors());

// Serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Define route handler for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Middleware
app.use(express.json());

// Use states routes
app.use('/states', require('./routes/states'));

// Default route for handling 404 errors
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// Start the server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Read the JSON file
fs.readFile('./model/statesData.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        const statesData = JSON.parse(data);
        console.log(statesData);
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});
