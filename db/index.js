const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        if (this.connection) return;
        mongoose.connect('mongodb://localhost:27017/graphqldb')
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
