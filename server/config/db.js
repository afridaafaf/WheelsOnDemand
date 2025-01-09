const mongoose = require('mongoose');

// Define the MongoDB URI directly in the code
const MONGO_URI = "mongodb://127.0.0.1:27017/Project";

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined');
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
