const Movie = require('../models/movie');

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
                videoUrl  // store full video url in model
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
}

module.exports = AdminController;
