const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config/jwtConfig');

class AuthController {
    async register(req, res) {
        const { username, password, email, firstName, lastName, sex, dob } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Username, email and password required' });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password: hashedPassword,
            email,
            firstName,
            lastName,
            sex,
            dob
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    }

    async login(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign({ username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ username: user.username, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
        await RefreshToken.create({ token: refreshToken, username: user.username });
        res.json({ accessToken, refreshToken });
    }

    async refreshToken(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(403).json({ message: 'Refresh token required' });
        }
        const stored = await RefreshToken.findOne({ token: refreshToken });
        if (!stored) {
            return res.status(403).json({ message: 'Refresh token not found, login again' });
        }
        try {
            const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
            const accessToken = jwt.sign({ username: payload.username }, JWT_SECRET, { expiresIn: '15m' });
            res.json({ accessToken });
        } catch (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
    }

    me(req, res) {
        res.json({ user: req.user });
    }

    async adminLogin(req, res) {
        const { username, password } = req.body;
        if (username === 'admin' && password === '123456') {
            const accessToken = jwt.sign({ username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({ accessToken });
        }
        return res.status(401).json({ message: 'Invalid admin credentials' });
    }
}

module.exports = AuthController;
