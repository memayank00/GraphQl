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

// Get all movies (for user dashboard)
router.get('/movies', (req, res) => adminController.getAllMovies(req, res));

// Admin get all movies
router.get('/admin/movies', authenticateJWT, (req, res) => adminController.getAllMovies(req, res));

// Admin get movies added by admin only
router.get('/admin/my-movies', authenticateJWT, (req, res) => adminController.getAdminMovies(req, res));

// Admin delete movie
router.delete('/admin/movies/:id', authenticateJWT, (req, res) => adminController.deleteMovie(req, res));

// Admin update movie
router.put(
  '/admin/movies/:id',
  authenticateJWT,
  upload.fields([{ name: 'image' }, { name: 'video' }]),
  (req, res) => adminController.updateMovie(req, res)
);

// Optionally, get movies added by the logged-in user
// router.get('/my-movies', authenticateJWT, (req, res) => adminController.getMoviesByUser(req, res));

module.exports = router;
