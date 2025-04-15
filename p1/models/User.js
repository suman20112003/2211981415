const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobileNo: String,
  githubUsername: String,
  roolNo: String,
  collageName: String,
  accessCode: String,
  clientId: String,
  clientSecret: String,
  accessToken: String,
});

module.exports = mongoose.model('User', userSchema);
