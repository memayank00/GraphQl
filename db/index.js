const mongoose = require('mongoose');
require('dotenv').config();

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        if (this.connection) return;
        const env = process.env.NODE_ENV || 'development';
        let mongoUri;
        if (env === 'production') {
            mongoUri = process.env.MONGO_URI_PROD || 'mongodb://localhost:27017/graphqldb_prod';
        } else {
            mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/graphqldb';
        }
        console.log("Mongo URI:", mongoUri);
        mongoose.connect(mongoUri)
        .then(() => {
            console.log('Database connection successful');
            this.connection = mongoose.connection;
        })
        .catch(err => {
            console.error('Database connection error');
        });
    }
}

module.exports = new Database();
