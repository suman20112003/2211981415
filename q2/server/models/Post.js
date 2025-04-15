const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postId: String,
  userId: String,
  content: String
});

module.exports = mongoose.model('Post', postSchema);
