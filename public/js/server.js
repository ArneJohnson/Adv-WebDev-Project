const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Serve static files (JS, CSS, images, etc.) from the 'public' folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve the index.html when visiting the root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html')); // Go up one level to root
});

// Serve the JSON data from /api/shops
app.get("/api/shops", (req, res) => {
    fs.readFile(path.join(__dirname, '..', 'stores.json'), 'utf8', (err, data) => { // Go up one level to root
        if (err) {
            return res.status(500).send({ message: err });
        }

        try {
            const jsonData = JSON.parse(data); // Parse the JSON data
            res.json(jsonData); // Respond with the JSON data
        } catch (parseErr) {
            return res.status(500).send({ message: parseErr });
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
