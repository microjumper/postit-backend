import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
const port = 3000;

mongoose.connect("mongodb://localhost:27017/postitdb", {useNewUrlParser: true, useUnifiedTopology: true});
const postSchema = {
    title: String,
    content: String
};
const Post = mongoose.model("Post", postSchema);

app.get('/', (req, res) => {
    res.send('Hi there!')
  });

app.get('/posts', (req, res) => {
    Post.find((err, posts) => err ? res.sendStatus(404) : res.json(posts))
});

app.post('/posts', (req, res) => {
    console.log(req.body)
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save((err, post) => err ? res.sendStatus(500) : res.json(post));
});

app.listen(port, () => {
  console.log(`PostIT backend is listening at http://localhost:${port}`)
});