// models/Post.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    replies: [String]
});

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    comments: [commentSchema]
});

module.exports = mongoose.model('Post', postSchema);
