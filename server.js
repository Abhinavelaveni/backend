const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://abhinav:<abcd123>@cluster0.cm8iv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a schema for the text
const textSchema = new mongoose.Schema({
    content: String,
    timestamp: { type: Date, default: Date.now }
});

const TextModel = mongoose.model('Text', textSchema);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// POST endpoint to receive text
app.post('/api/send-text', async (req, res) => {
    const text = req.body.text;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const newText = new TextModel({ content: text });
        await newText.save();
        res.status(200).json({ message: 'Text saved successfully', text });
    } catch (err) {
        console.error('Failed to save text:', err);
        res.status(500).json({ error: 'Failed to save text' });
    }
});

// GET endpoint to view saved text
app.get('/api/view-text', async (req, res) => {
    try {
        const texts = await TextModel.find().sort({ timestamp: -1 });
        res.status(200).json({ message: 'Text retrieved successfully', texts });
    } catch (err) {
        console.error('Failed to retrieve text:', err);
        res.status(500).json({ error: 'Failed to retrieve text' });
    }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Backend server is running on http://0.0.0.0:${port}`);
});