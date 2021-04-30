import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const app = express();
app.use(cors(), express.json());

const port = 3000;
app.listen(port, () => {
    console.log(`PostIT backend is listening at http://localhost:${port}`)
});

mongoose.connect("mongodb://localhost:27017/postitdb", { useNewUrlParser: true, useUnifiedTopology: true });
const postSchema = {
    title: String,
    content: String
};
const Post = mongoose.model("Post", postSchema);

const userSchema = {
    user: String,
    password: String
};
const User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
    res.send('Benvenuto su PostIT!')
});

app.route('/login')
    .post((req, res) => {
        User.findOne({ username: req.body.username, password: req.body.password }, (err, user) => {
            if (user) {
                const token = generateAccessToken({ user });
                res.json({
                    id: user._id,
                    token
                })
            } else {
                res.sendStatus(404);
            }
        })
    });

app.route('/users/:username')
    .get(authenticateToken, (req, res) => User.findOne({ username: req.params.username },
        (err, user) => user ? res.json(user) : res.sendStatus(404)))

app.route('/posts')
    .get(authenticateToken, (req, res) => {
        Post.find((err, posts) => err ? res.sendStatus(404) : res.json(posts))
    })

    .post(authenticateToken, (req, res) => {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });
        post.save((err, post) => err ? res.sendStatus(500) : res.json(post));
    });

app.route('/posts/:title')
    .get(authenticateToken, (req, res) => Post.findOne({ title: req.params.title },
        (err, post) => post ? res.json(post) : res.sendStatus(404)))

    .post(authenticateToken, (req, res) => {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });
        post.save((err, post) => err ? res.sendStatus(500) : res.json(post));
    });

function generateAccessToken(id) {
    return jwt.sign(id, process.env.SECRET);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            console.log(err.message)
            return res.sendStatus(403);
        }

        req.user = user;

        next();
    })
}