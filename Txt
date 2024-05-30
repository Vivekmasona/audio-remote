const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let audioUrl = ''; // Current audio URL
let sessionId = ''; // Session ID
let audioStatus = 'stop'; // Audio player status
let volume = 100; // Initial volume

app.post('/update-url', (req, res) => {
    const { url } = req.body;
    audioUrl = url;
    sessionId = generateSessionId(); // Generate a unique session ID
    res.json({ status: 'URL updated', sessionId: sessionId });
});

app.post('/control', (req, res) => {
    const { action, value } = req.body;
    
    if (action === 'play') {
        audioStatus = 'play';
    } else if (action === 'pause') {
        audioStatus = 'pause';
    } else if (action === 'stop') {
        audioStatus = 'stop';
    } else if (action === 'volume') {
        volume = value; // Update volume
    }

    res.json({ status: 'Action received', action });
});

app.get('/current-url', (req, res) => {
    const { id } = req.query;
    // Check if the session ID matches
    if (id === sessionId) {
        res.json({ url: audioUrl, status: audioStatus, volume: volume });
    } else {
        res.status(404).json({ error: 'Session not found' });
    }
});

// Function to generate a unique session ID
function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

