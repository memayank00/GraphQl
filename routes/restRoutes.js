const express = require('express');
const RestController = require('../controllers/restController');
const AuthController = require('../controllers/authController');
const multer = require('multer');
const AdminController = require('../controllers/adminController');
const authenticateJWT = require('../middleware/auth');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
const restController = new RestController();
const authController = new AuthController();
const adminController = new AdminController();

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

// Admin login
router.post('/admin/login', (req, res) => authController.adminLogin(req, res));

// Admin add movie (protected)
router.post(
  '/admin/movies',
  // authenticateJWT, // <-- Authenticate before upload/controller
  upload.fields([{ name: 'image' }, { name: 'video' }]),
  (req, res) => adminController.addMovie(req, res)
);

module.exports = router;
