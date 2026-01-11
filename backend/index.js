const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { connectDB } = require('./db');
const Submission = require('./models/model');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err.message));

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

app.get('/api/quiz', async (req, res) => {
  try {
    const amount = req.query.amount || 15;
    // Proxy OpenTDB response so frontend can consume the same format
    const resp = await axios.get(`https://opentdb.com/api.php?amount=${amount}`);
    // resp.data already has { response_code, results }
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Save submission with email and results
app.post('/api/submit', async (req, res) => {
  try {
    console.log('POST /api/submit body:', req.body);
    const { email, score, answers, meta } = req.body || {};

    // Allow submissions without email (email is optional)
    const sub = new Submission({
      email: email || null,
      score: score || 0,
      answers: answers || [],
      meta: meta || {}
    });
    const saved = await sub.save();
    console.log('Submission saved:', saved._id);
    res.json({ success: true, submission: saved });
  } catch (err) {
    console.error('Error in /api/submit:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Debug: list recent submissions (for verification in Postman)
app.get('/api/submissions', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 500);
    const filter = {};
    if (req.query.email) filter.email = req.query.email;
    const subs = await Submission.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    res.json({ success: true, submissions: subs });
  } catch (err) {
    console.error('Error in /api/submissions:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`backend running on http://localhost:${PORT}`));