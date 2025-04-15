const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/User');
const https = require('https');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/evaluation').then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

app.post('/register', async (req, res) => {
  const {
    name, email, mobileNo, githubUsername,
    roolNo, collageName, accessCode
  } = req.body;

  try {
    const registerRes = await axios.post('https://20.244.56.144/evaluatation-service/register', {
      name, email, mobileNo, githubUsername, roolNo, collageName, accessCode
    }, { httpsAgent });

    const { clientId, clientSecret } = registerRes.data;

   
    const user = new User({
      name, email, mobileNo, githubUsername,
      roolNo, collageName, accessCode,
      clientId, clientSecret
    });
    await user.save();

    res.json({ message: "Registered successfully", clientId, clientSecret });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const loginRes = await axios.post('https://20.244.56.144/evaluatation-service/login', {
      clientId: user.clientId,
      clientSecret: user.clientSecret
    }, { httpsAgent });

    const { token_type, access_token } = loginRes.data;

    user.accessToken = access_token;
    await user.save();

    res.json({ token_type, access_token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
