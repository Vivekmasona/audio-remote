const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // For generating unique codes

const app = express();
app.use(bodyParser.json());
app.use(cors());

const sessions = {}; // Store session data

app.post('/create-session', (req, res) => {
    const sessionId = uuidv4();
    sessions[sessionId] = {
        audioStatus: 'stop',
        audioUrl: '',
        volume: '100%'
    };
    res.json({ sessionId });
});

app.post('/control', (req, res) => {
    const { sessionId, action, value } = req.body;

    if (!sessions[sessionId]) {
        return res.status(404).json({ error: 'Session not found' });
    }

    if (action === 'play' || action === 'pause' || action === 'stop') {
        sessions[sessionId].audioStatus = action;
    } else if (action === 'volume') {
        const numericValue = parseInt(value);
        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
            sessions[sessionId].volume = numericValue + '%';
        }
    }

    res.json({ status: 'Button click received', action });
});

app.get('/audio-status', (req, res) => {
    const { sessionId } = req.query;

    if (!sessions[sessionId]) {
        return res.status(404).json({ error: 'Session not found' });
    }

    res.json(sessions[sessionId]);
});

app.post('/update-url', (req, res) => {
    const { sessionId, url } = req.body;

    if (!sessions[sessionId]) {
        return res.status(404).json({ error: 'Session not found' });
    }

    sessions[sessionId].audioUrl = url;
    res.json({ status: 'URL updated' });
});

app.get('/current-url', (req, res) => {
    const { sessionId } = req.query;

    if (!sessions[sessionId]) {
        return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ url: sessions[sessionId].audioUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
