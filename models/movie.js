const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    genre: String,
    language: String,
    releaseDate: String,
    duration: String,
    cast: String,
    director: String,
    image: String, // filename
    video: String, // filename
    imageUrl: String, // full url
    videoUrl: String  // full url
});

module.exports = mongoose.model('Movie', movieSchema);
