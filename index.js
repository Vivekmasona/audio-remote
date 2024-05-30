const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let audioUrl = ''; // Current audio URL
let sessions = {}; // Object to store session IDs

// Endpoint to update the audio URL and generate a session ID
app.post('/update-url', (req, res) => {
    const { url } = req.body;
    audioUrl = url;
    const sessionId = generateSessionId(); // Generate a unique session ID
    sessions[sessionId] = { url: audioUrl, playing: false }; // Store the audio URL and playing status
    res.json({ status: 'URL updated', sessionId: sessionId });
});

// Endpoint to control the audio playback using the session ID
app.post('/control/:sessionId', (req, res) => {
    const { action } = req.body;
    const { sessionId } = req.params;
    
    if (sessions[sessionId]) {
        if (action === 'play') {
            sessions[sessionId].playing = true;
        } else if (action === 'pause' || action === 'stop') {
            sessions[sessionId].playing = false;
        }
        res.json({ status: 'Action received', action });
    } else {
        res.status(404).json({ error: 'Session not found' });
    }
});

// Endpoint to retrieve the current audio URL and playing status using the session ID
app.get('/current-url/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    if (sessions[sessionId]) {
        res.json({ url: sessions[sessionId].url, playing: sessions[sessionId].playing });
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
