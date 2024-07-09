// import mongoose from 'mongoose';
const mongoose = require('mongoose')
const config = require('../config')
const connectDB_ = async () => {
  try {
    //const conn = await mongoose.connect(process.env.CONNECTION_STRING);
    const conn = await mongoose.connect(config.CONNECTION_STRING, {
      // authSource: config.AUTH_SOURCE,
      // user: config.DB_USER,
      // pass: config.DB_PASS,    
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
    })
    mongoose.pluralize(null);
  
    mongoose.set('debug', false);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

exports.connectDB_ = connectDB_
