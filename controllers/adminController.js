const Movie = require('../models/movie');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

class AdminController {
    async addMovie(req, res) {
        try {
            const user = req.user || {};
            console.log("=======>",user.username)
            // if (!(user && user.username === 'admin')) {
            //     return res.status(403).json({ message: 'Unauthorized' });
            // }
            const { title, description, genre, language, releaseDate, duration, cast, director } = req.body;
            const image = req.files?.image?.[0]?.filename || '';
            const video = req.files?.video?.[0]?.filename || '';
            const imageUrl = image ? `${req.protocol}://${req.get('host')}/uploads/${image}` : '';
            const videoUrl = video ? `${req.protocol}://${req.get('host')}/uploads/${video}` : '';
            const movie = new Movie({
                title,
                description,
                genre,
                language,
                releaseDate,
                duration,
                cast,
                director,
                image,
                video,
                imageUrl, // store full image url in model
                videoUrl, // store full video url in model
                createdBy: user.username || 'admin'
            });
            await movie.save();
            res.status(201).json({
                message: 'Movie added successfully',
                movie: movie.toObject()
            });
        } catch (err) {
            res.status(500).json({ message: 'Failed to add movie', error: err.message });
        }
    }

    async getMoviesByUser(req, res) {
        try {
            const user = req.user || {};
            const movies = await Movie.find({ createdBy: user.username });
            res.json({ movies });
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch movies', error: err.message });
        }
    }

    async getAllMovies(req, res) {
        try {
            const movies = await Movie.find({});
            res.json({ movies });
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch movies', error: err.message });
        }
    }

    async deleteMovie(req, res) {
        try {
            const user = req.user || {};
            if (!(user && user.username === 'admin')) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            const { id } = req.params;
            const movie = await Movie.findById(id);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            // Remove image file if exists
            if (movie.image) {
                const imagePath = path.join(__dirname, '..', 'uploads', movie.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            // Remove video file if exists
            if (movie.video) {
                const videoPath = path.join(__dirname, '..', 'uploads', movie.video);
                if (fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath);
                }
            }

            await Movie.findByIdAndDelete(id);
            res.json({ message: 'Movie deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete movie', error: err.message });
        }
    }

    async updateMovie(req, res) {
        try {
            const user = req.user || {};
            if (!(user && user.username === 'admin')) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            const { id } = req.params;
            const updateData = { ...req.body };
            // If files are uploaded, update image/video
            if (req.files?.image?.[0]) {
                updateData.image = req.files.image[0].filename;
                updateData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.image[0].filename}`;
            }
            if (req.files?.video?.[0]) {
                updateData.video = req.files.video[0].filename;
                updateData.videoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.video[0].filename}`;
            }
            const movie = await Movie.findByIdAndUpdate(id, updateData, { new: true });
            res.json({ message: 'Movie updated successfully', movie });
        } catch (err) {
            res.status(500).json({ message: 'Failed to update movie', error: err.message });
        }
    }

    async getAdminMovies(req, res) {
        try {
            const user = req.user || {};
            if (!(user && user.username === 'admin')) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            // Show all movies, not just those created by admin
            const movies = await Movie.find({});
            res.json({ movies });
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch movies', error: err.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const user = req.user || {};
            if (!(user && user.username === 'admin')) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            const users = await User.find({}, { password: 0 }).sort({ createdAt: 1 });;
            res.json({ users });
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch users', error: err.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const user = req.user || {};
            if (!(user && user.username === 'admin')) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            const { id } = req.params;
            await User.findByIdAndDelete(id);
            res.json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Failed to delete user', error: err.message });
        }
    }

    async updateUser(req, res) {
        try {
            const user = req.user || {};
            if (!(user && user.username === 'admin')) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            const { id } = req.params;
            const updateData = { ...req.body };
            delete updateData.password; // Don't allow password update here
            const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, fields: { password: 0 } });
            res.json({ message: 'User updated successfully', user: updatedUser });
        } catch (err) {
            res.status(500).json({ message: 'Failed to update user', error: err.message });
        }
    }
}

module.exports = AdminController;
