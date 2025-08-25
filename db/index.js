const mongoose = require('mongoose');
require('dotenv').config();
const username = process.env.DB_USER;
const password = encodeURIComponent(process.env.DB_PASS);
const cluster = process.env.DB_CLUSTER;
const dbName = process.env.DB_NAME;

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        if (this.connection) return;
        const env = process.env.NODE_ENV || 'development';
        let mongoUri;
        if (env === 'production') {
             mongoUri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=AWSGraphQl`;
        } else {
            mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/graphqldb';
             // mongoUri = `mongodb+srv://memayank00:${encodeURIComponent("Hughes@87654321")}@awsgraphql.igqbisn.mongodb.net/graphqldb_prod?retryWrites=true&w=majority&appName=AWSGraphQl`;

        }
        console.log("Mongo URI:", mongoUri);
        mongoose.connect(mongoUri)
        .then(() => {
            console.log('Database connection successful');
            this.connection = mongoose.connection;
        })
        .catch(err => {
            console.error('Database connection error',err);
        });
    }
}

module.exports = new Database();
