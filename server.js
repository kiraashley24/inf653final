require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Apply the CORS middleware
app.use(cors());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// root URL
app.use('/', require('./routes/root'));

// Middleware
app.use(express.json());

// Use states routes
app.use('/states', require('./routes/states'));


//404
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


// Read the JSON file
fs.readFile('./model/statesData.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        // Parse the JSON data into a JavaScript object
        const statesData = JSON.parse(data);
        //use the statesData object in application
        console.log(statesData);
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});
// Start the server
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});