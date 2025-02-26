const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://abhinav:<abcd123>@cluster0.cm8iv.mongodb.net/abhinav?retryWrites=true&w=majority&appName=Cluster0';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Exit the application if the connection fails
    }
}

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
        const db = client.db('myFirstDatabase'); // Replace with your database name
        const collection = db.collection('texts'); // Replace with your collection name

        // Insert the text into the collection
        const result = await collection.insertOne({ content: text, timestamp: new Date() });
        res.status(200).json({ message: 'Text saved successfully', text, result });
    } catch (err) {
        console.error('Failed to save text:', err);
        res.status(500).json({ error: 'Failed to save text' });
    }
});

// GET endpoint to view saved text
app.get('/api/view-text', async (req, res) => {
    try {
        const db = client.db('myFirstDatabase'); // Replace with your database name
        const collection = db.collection('texts'); // Replace with your collection name

        // Retrieve all texts sorted by timestamp
        const texts = await collection.find().sort({ timestamp: -1 }).toArray();
        res.status(200).json({ message: 'Text retrieved successfully', texts });
    } catch (err) {
        console.error('Failed to retrieve text:', err);
        res.status(500).json({ error: 'Failed to retrieve text' });
    }
});

// Start the server and connect to MongoDB
async function startServer() {
    await connectToMongoDB();
    app.listen(port, '0.0.0.0', () => {
        console.log(`Backend server is running on http://0.0.0.0:${port}`);
    });
}

startServer().catch(console.dir);