const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/User');
const middleware = require('../utils/middleware');

usersRouter.post('/', async (req, res) => {
    const { uName, name, pass, walletAddress } = req.body;
    if (!uName || !name || !pass || !walletAddress) {
        const e = new Error('missing parameters');
        e.name = 'ValidationError';
        throw e;
    }
    const passHash = await bcrypt.hash(pass, 10);
    const user = new User({
        uName,
        name,
        passHash,
        walletAddress,
        uuid: crypto.randomUUID(),
    });

    const savedUser = await user.save();
    console.log(savedUser);
    res.status(201).json(savedUser);
});

usersRouter.get('/', async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

usersRouter.delete(
    '/',
    [middleware.extractToken, middleware.extractUser, middleware.filterLoggedIn],
    async (req, res) => {
        await User.deleteOne({ uuid: req.user.uuid });
        res.status(204).end();
    },
);

module.exports = usersRouter;
