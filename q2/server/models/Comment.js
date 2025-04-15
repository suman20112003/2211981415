const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentId: String,
  postId: String,
  content: String
});

module.exports = mongoose.model('Comment', commentSchema);
