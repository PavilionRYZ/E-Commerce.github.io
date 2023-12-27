// const { error } = require("console");
const mongoose = require("mongoose");
require('dotenv');

// Connect to MongoDB database using Mongoose.
const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URL)
    .then((data)=>{
        console.log(`MongoDB is connected with server:${data.connection.host}`);
    })
}

module.exports = connectDatabase