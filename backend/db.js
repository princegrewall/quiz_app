require('dotenv').config();
const mongoose = require('mongoose');

// Only use MONGO_URI from .env
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) console.warn('Warning: MONGO_URI is not set in environment variables');

mongoose.set('strictQuery', false);

function connectDB() {
  return mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    //console.log("MongoDB connected");
  });
}

module.exports = { connectDB, mongoose, MONGO_URI };
