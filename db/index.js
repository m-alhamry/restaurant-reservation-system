// A file to establish a connection to our database with mongoose

const mongoose = require('mongoose');

require('dotenv').config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Successfully connected to MongoDB database . . .');
    } catch (error) {
        console.error('Connection Error!', error.message);
    }
};

connect();

module.exports = mongoose.connection;