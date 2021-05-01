import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';

import { generateAccessToken, authenticateToken } from './jwt-utils.mjs';
import { User, Post } from './mongoose-chemas.mjs';

dotenv.config();

const saltRounds = 10;

const app = express();
app.use(cors(), express.json());

const port = 3000;
app.listen(port, () => {
    console.log(`PostIT backend is listening at http://localhost:${port}`)
});

app.get('/', (req, res) => {
    res.send('Benvenuto su PostIT!')
});

app.route('/register')
    .post((req, res) => {
        bcrypt.hash(req.body.password, saltRounds, (err, encrypted) => {
            if(err) {
                res.send(500);
            }
            const user = new User({
                username: req.body.username,
                password: encrypted 
            });
            user.save();
            const token = generateAccessToken({id: user._id, username: user.username});
            res.json(token)
        })
    });


app.route('/login')
    .post((req, res) => {
        User.findOne({ username: req.body.username }, (err, user) => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, same) => {
                    const token = generateAccessToken({id: user._id, username: user.username});
                    res.json(token)
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