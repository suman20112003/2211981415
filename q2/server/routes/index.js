const express = require('express');
const axios = require('axios');
const router = express.Router();
const https = require('https');

const API_BASE = 'https://20.244.56.144';
const TEST_BASE = 'http://20.244.56.144/test';

const agent = new https.Agent({ rejectUnauthorized: false });

router.get('/users', async (req, res) => {
  try {
    const result = await axios.get(`${API_BASE}/evaluatation-service/users`, { httpsAgent: agent });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/posts/:userId', async (req, res) => {
  try {
    const result = await axios.get(`${TEST_BASE}/users/${req.params.userId}/posts`);
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/comments/:postId', async (req, res) => {
  try {
    const result = await axios.get(`${TEST_BASE}/posts/${req.params.postId}/comments`);
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

module.exports = router;
