require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3500;

// Apply the CORS middleware
app.use(cors());

app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  })
   
  app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
  })
  
// Connect to MongoDB
connectDB();


//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Define route handler for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

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
