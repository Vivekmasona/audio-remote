const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let sessions = {};

app.post('/create-session', (req, res) => {
    const sessionId = Math.random().toString(36).substring(2, 10);
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
        return res.status(400).json({ error: 'Invalid session ID' });
    }

    if (action === 'play' || action === 'pause' || action === 'stop') {
        sessions[sessionId].audioStatus = action;
    } else if (action === 'volume') {
        if (value >= 0 && value <= 100) {
            sessions[sessionId].volume = value + '%';
        }
    }

    res.json({ status: 'Button click received', action });
});

app.get('/audio-status', (req, res) => {
    const { sessionId } = req.query;
    if (!sessions[sessionId]) {
        return res.status(400).json({ error: 'Invalid session ID' });
    }
    const { audioStatus, volume, audioUrl } = sessions[sessionId];
    res.json({ status: audioStatus, volume, url: audioUrl });
});

app.post('/update-url', (req, res) => {
    const { sessionId, url } = req.body;
    if (!sessions[sessionId]) {
        return res.status(400).json({ error: 'Invalid session ID' });
    }
    sessions[sessionId].audioUrl = url;
    res.json({ status: 'URL updated' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

