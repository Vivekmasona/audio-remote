const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let audioUrl = ''; // Current audio URL

// Endpoint to update the audio URL
app.post('/update-url', (req, res) => {
    const { url } = req.body;
    audioUrl = url;
    const sessionId = generateSessionId(); // Generate a unique session ID
    res.json({ status: 'URL updated', sessionId: sessionId, url: audioUrl });
});

// Endpoint to retrieve the current audio URL
app.get('/current-url', (req, res) => {
    res.json({ url: audioUrl });
});

// Function to generate a unique session ID
function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

