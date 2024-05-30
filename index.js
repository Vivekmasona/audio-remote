const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Object to store session IDs and corresponding URLs
const sessionUrls = {};

// Route to update URL with session ID
app.post('/update-url/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const { url } = req.body;

    sessionUrls[sessionId] = url; // Store URL with session ID
    res.json({ success: true });
});

// Route to control audio player
app.post('/control/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const { action } = req.body;

    // Check if session ID exists
    if (!sessionUrls[sessionId]) {
        return res.json({ success: false, error: 'Invalid session ID' });
    }

    // Perform action based on the request
    // For simplicity, just send back the URL along with the session ID
    res.json({ success: true, sessionId: sessionId });
});

// Route to retrieve current URL for a specific session ID
app.get('/current-url/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;

    // Check if session ID exists
    if (!sessionUrls[sessionId]) {
        return res.json({ success: false, error: 'Invalid session ID' });
    }

    res.json({ success: true, sessionId: sessionId, url: sessionUrls[sessionId] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

