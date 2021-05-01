import jwt from 'jsonwebtoken';

export function generateAccessToken(id) {
    return jwt.sign(id, process.env.SECRET);
}
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null)
        return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            console.log(err.message);
            return res.sendStatus(403);
        }

        req.user = user;

        next();
    });
}
