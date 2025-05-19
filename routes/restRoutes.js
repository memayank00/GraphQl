const express = require('express');
const RestController = require('../controllers/restController');
const AuthController = require('../controllers/authController');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();
const restController = new RestController();
const authController = new AuthController();

// User registration
router.post('/register', (req, res) => authController.register(req, res));

// User login
router.post('/login', (req, res) => authController.login(req, res));

// Refresh token
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));

// Get current user info (protected)
router.get('/me', authenticateJWT, (req, res) => authController.me(req, res));

// Example user routes
router.get('/users', restController.getUsers);
router.post('/users', restController.createUser);

module.exports = router;
