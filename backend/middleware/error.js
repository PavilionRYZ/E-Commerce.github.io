const ErrorHandler =  require("../utils/errorhander");

module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error !!!";

    // Wrong Mongoose Object ID Error
    if(err.name === "CastError"){
        const message = `Resource not found.Invalid:${err.path}`;
        err = new ErrorHandler(message,400);
    }
    // Handling Mongoose Validation Error
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map(value => value.message);
        err = new ErrorHandler(message,400);
    }
    // Handling Mongoose duplicate key errors
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }
    // Handling wrong JWT error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is Invalid`;
        err = new ErrorHandler(message,400);
    }    
    // Handling Expired JWT error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is Expired`;
        err = new ErrorHandler(message,400);
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}
/**
This code defines an error handling middleware for an Express.js application. The middleware is designed to handle errors by responding with a JSON object containing information about the error.
 Let's break down the code:
 Import Error Handler Class:

`const ErrorHandler = require("../utils/errorhander");: `

This line imports the ErrorHandler class or module 
from the "../utils/errorhander" path. The ErrorHandler class is likely the custom error handler 
class explained in the previous answer.

Error Handling Middleware:

`module.exports = (err, req, res, next) => { ... }:` This module exports a function that serves as
 an error handling middleware for Express.js. Error handling middleware functions in Express have 
 four parameters (err, req, res, and next).
Set Default Values:

`err.statusCode = err.statusCode || 500;:`

 If the error object (err) does not have a specified statusCode, it sets a default value of
  500 (Internal Server Error).

`err.message = err.message || "Internal Server Error !!!";:`

 If the error object (err) does not have a specified message, it sets a default error message of 
 "Internal Server Error !!!".
JSON Response:

`res.status(err.statusCode).json({ success: false, error: err.stack });:` 

This line sends a JSON response with the following properties:
success: A boolean indicating whether the operation was successful (set to false since it's an error response).
error: The stack trace of the error. The err.stack contains information about the error, including the stack trace,
 making it easier to diagnose and fix issues.
This middleware is intended to be used globally or for specific routes to catch and handle errors that occur during
 the processing of requests. When an error occurs in the application, this middleware sets the HTTP status code,
  creates a JSON response with error details, and sends it back to the client. The stack trace in the response can
   be useful during development but should be handled more carefully in a production environment to avoid exposing 
   sensitive information.
 */