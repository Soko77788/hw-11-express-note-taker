const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'develop/public' directory
app.use(express.static(path.join(__dirname, 'develop/public')));

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'develop/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'develop/public/index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'develop/db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});
 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
