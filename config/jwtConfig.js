require('dotenv').config();

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret'
};
