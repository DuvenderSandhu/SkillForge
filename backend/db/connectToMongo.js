// db/connectToMongo.js

import mongoose from "mongoose";


/**
 * Connect to MongoDB.
 * 
 * @param {String} uri - MongoDB connection string.
 */
const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectToMongo;
