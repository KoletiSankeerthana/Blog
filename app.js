const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 📌 Step 1: Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 📌 Step 2: Create Schema & Model
const commentSchema = new mongoose.Schema({
    text: String,
    replies: [String]
});

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    comments: [commentSchema]
});

const Post = mongoose.model('Post', postSchema);

// Home
app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('index', { posts });
});

// New Post Form
app.get('/new', (req, res) => {
    res.render('new');
});

// Add New Post
app.post('/add', async (req, res) => {
    const { title, content } = req.body;
    const newPost = new Post({ title, content, comments: [] });
    await newPost.save();
    res.redirect('/');
});

// Edit Form
app.get('/edit/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('edit', { post });
});

// Update Post
app.post('/edit/:id', async (req, res) => {
    const { title, content } = req.body;
    await Post.findByIdAndUpdate(req.params.id, { title, content });
    res.redirect('/');
});

// Delete Post
app.post('/delete/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Add Comment
app.post('/comment/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post && req.body.comment) {
        post.comments.push({ text: req.body.comment, replies: [] });
        await post.save();
    }
    res.redirect('/');
});

// Add Reply to Comment
app.post('/reply/:postId/:commentIndex', async (req, res) => {
    const post = await Post.findById(req.params.postId);
    const index = req.params.commentIndex;
    if (post && post.comments[index] && req.body.reply) {
        post.comments[index].replies.push(req.body.reply);
        await post.save();
    }
    res.redirect('/');
});



    const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
