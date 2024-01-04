const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User  = require("../models/userModel");


/**
 This code defines two middleware functions that are commonly used for
 user authentication and authorization in a Node.js application. Let's break down each part:
 */


// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    const {token }= req.cookies;
    if(!token){
        return next(new ErrorHandler("Login First to access this resource",401));
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET)
    req.user =  await User.findById(decodedData.id);
    next();
})


 /**
  catchAsyncErrors: This is likely a utility function that wraps asynchronous functions with error handling.
   If an error occurs in the asynchronous function, it passes the error to the next function, allowing it to 
   be caught by any error-handling middleware.

Checking Token Presence: It checks if a JWT token is present in the request cookies. If not, it returns an error response 
indicating that the user needs to log in to access the resource.

Verify JWT Token: It uses the jwt.verify method to verify and decode the JWT token using the secret key stored in 
process.env.JWT_SECRET.

Fetch User Information: It uses the decoded user ID to fetch user information from the database (assuming a MongoDB 
    database with Mongoose, given the usage of User.findById), and attaches it to the req.user property for further
     use in subsequent middleware or route handlers.
  */


// Handling users roles

exports.authorizedRoles = (...roles) =>{
    return(req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(
            new ErrorHandler(
                `Role:${req.user.role} is not allowed to Access this resource`,
                403)
            );
        }
        next();
    }
}

/**
 Checking User Roles: This middleware checks if the user's role (extracted from the req.user 
    object set in the previous middleware) is included in the specified roles passed as arguments
     to the authorizedRoles function.

Error Handling: If the user's role is not allowed, it returns an error response with a status code 
of 403 (Forbidden) and a message indicating that the user's role is not allowed to access the resource.

Move to Next Middleware: If the user's role is allowed, it moves to the next middleware or route handler
 in the stack.

Notes:
Both of these middlewares utilize the next function to either move to the next middleware or route handler or 
to pass an error to the error-handling middleware.

The catchAsyncErrors middleware is likely used to handle asynchronous errors and pass them to the error-handling 
middleware.

These middlewares are designed to be used in routes where you want to ensure that a user is authenticated (isAuthenticatedUser) 
and has the appropriate roles (authorizedRoles).
 */

