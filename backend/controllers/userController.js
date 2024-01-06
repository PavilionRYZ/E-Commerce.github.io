const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User  = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { log } = require("console");

// register  user
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepic.jpg"
        }
    });
sendToken(user,201,res);
});


// Login User
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;

    // Check if email and password is entered by user is correct
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Your Credentials",400));
    } 

    const user =await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Credentials",401))
    }
    const isPasswordMatched = user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Credentials",401))
    }

    sendToken(user,200,res);
});

// Logout user
exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
});

// forgot Password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404))
    }

    // Get Reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    // Create Reset Password URL

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`;
   
    try{
        await sendEmail({
            email:user.email,
            subject:"ShopIT Password Recovery",
            message
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email}`
        })
    }catch(error){
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500))
    }
})

// Reset Password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    // Hash URL Token
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("Password reset token is invalid or has been expired",400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400))
    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    sendToken(user,200,res);

});

// Get user details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
});

// Update Password
exports.updatePassword = catchAsyncErrors(async (req,res,next)=> {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("old password is incorrect"));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400))
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
})

// Update Profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }

    // Update Avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    })
}); 

//get all users (Admin)
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })
});

// get single user details (Admin)
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
});

// Update User Role(Admin)
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success:true
    })
});

// Delete User (Admin)
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`))
    }

    // Remove Avatar TODO

    // await user.remove();

    res.status(200).json({
        success:true
    })
});