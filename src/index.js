import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
const port = 3000;

mongoose.connect("mongodb://localhost:27017/postitdb", { useNewUrlParser: true, useUnifiedTopology: true });
const postSchema = {
    title: String,
    content: String
};
const Post = mongoose.model("Post", postSchema);

app.get('/', (req, res) => {
    res.send('Hi there!')
});

app.route('/posts')
    .get((req, res) => Post.find((err, posts) => err ? res.sendStatus(404) : res.json(posts)))
    
    .post((req, res) => {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });
        post.save((err, post) => err ? res.sendStatus(500) : res.json(post));
    }
);

app.route('/posts/:title')
    .get((req, res) => Post.findOne({title: req.params.title},
        (err, post) => post ? res.json(post) : res.sendStatus(404)))
    
    .post((req, res) => {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });
        post.save((err, post) => err ? res.sendStatus(500) : res.json(post));
    }
);

app.listen(port, () => {
    console.log(`PostIT backend is listening at http://localhost:${port}`)
});