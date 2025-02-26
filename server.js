const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Import the file system module
const path = require('path'); // Import the path module for file paths

const app = express();
const port = 3000; // You can change this to any port you prefer
const cors = require('cors');
app.use(cors()); // Enable CORS for all routes

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint to receive text
app.post('/api/send-text', (req, res) => {
    const text = req.body.text; // Get the text from the request body
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    console.log('Received text:', text); // Log the text to the console

    // Define the file path
    const filePath = path.join(__dirname, 'received-text.log');

    // Append the text to the file
    fs.appendFile(filePath, `${text}\n`, (err) => {
        if (err) {
            console.error('Failed to write text to file:', err);
            return res.status(500).json({ error: 'Failed to save text' });
        }

        console.log('Text saved to file:', filePath);
        res.status(200).json({ message: 'Text received and saved successfully', text });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});