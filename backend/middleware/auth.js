const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User  = require("../models/userModel");

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