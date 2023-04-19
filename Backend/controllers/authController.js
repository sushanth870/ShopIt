const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { use } = require("../router/product");

// To user registration => /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, password, email } = req.body;
  const user = await User.create({
    name,
    password,
    email,
    avatar: {
      public_id: "unsplach/face",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
    },
  });

  sendToken(user, 200, res); //creating token and assign in cookie
});

// To user login => /api/v1/login
exports.userLogin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;                   
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));          // 400 : bad request
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Please enter valid email and password", 401));    // 401 : authantication error
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Please enter correct password", 401));
  }
  sendToken(user, 200, res);
});


//to user logout=> /api/v1/logout
exports.userLogOut = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("You need to login to logout", 401));
  }
  //  method 1
  // res.clearCookie('token');
  // res.send('cookie token cleard');
  // method 2
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });

});

//to send mail (reset Password) forgot password=> /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) =>{
  const user = await User.findOne({email: req.body.email});

  if(!user){
    return next(new ErrorHandler("user not found",404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({validateBeforeSave: false})

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
                    // http or https://{domain}/api/v1/password/reset/:token;
try{  await sendEmail({
    email: user.email,
    subject: 'ShopItPassWord Recovery',
    message:`Your password reset token is as follow:\n\n${resetURL}\n\n Ignore if you have not requested this email, `,
  })
  res.status(200).json({
    success: true,
    message: `email sent to ${user.email}`
  })
} 
  catch(error){ 
    user.getResetPasswordToken=undefined;
    user.getResetPasswordExpire=undefined;
    await user.save({validateBeforeSave:false});
    return next(new ErrorHandler(error.message,500));
  }


})

// //to verify resetPasswoed token which sent to mail=> /api/v1/password/reset
exports.resetPassword = catchAsyncError(async (req, res, next) =>{

    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    

    const user = await User.findOne({ 
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now()} //if greater than now
    });

      if(!user){
        return next(new ErrorHandler("Password reset token is invalied or has been expired",400))
      }

    if(req.body.password !== req.body.confirmPassword){
      return next(new ErrorHandler("confirm password not matched",400));
    }

    user.password=req.body.password;
    user.resetPasswordExpire=undefined;
    user.resetPasswordToken=undefined;

    await user.save();
    sendToken(user, 200, res)
})


//get currently logged in user details => /api/v1/me

exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  })

  
})

//update password => /api/v1/password/update

exports.updatePassword = catchAsyncError(async (req, res, next) => {

  const user = await User.findById(req.user.id).select('+password');

  const isMatched = await user.comparePassword(req.body.oldPassword);

  if(!isMatched){
    return next(new ErrorHandler("Oldpassword not matched",400));
  }

  user.password=req.body.password;
  await user.save();

  sendToken(user, 200, res);

})

//update user profile => /api/v1/me/update

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserDate = {
    name:req.body.name,
    email:req.body.email
  }
  //Avatar need todo
  const user = await User.findByIdAndUpdate(req.user.id,newUserDate,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  });

  res.status(200).json({
    success: true
  })

})

//Get all user => //api/v1/admin/users

exports.allUsers = catchAsyncError(async (req, res, next) => {
  const users =await User.find();
  const usersCount = await User.countDocuments();
  res.status(200).json({
    success: true,
    usersCount,
    users

  })
}) 

// Get each user detail => //api/v1/admin/user/:id
exports.getUserDetails = catchAsyncError(async (req, res, next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`user does not found with this id:${req.params.id}`,404))
  }

  res.status(200).json({
    success: true,
    user
  })
})

// Update user detail => //api/v1/admin/user/update/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
  var user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`user not found with this id:${req.params.id}`,400));
  }
  const newUserDate={
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }

    user=await User.findByIdAndUpdate(req.params.id,newUserDate, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
  res.status(200).json({
    success: true,
    user
  })
})

// user Delete detail => api/v1/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return(next(new ErrorHandler(`user not found with this id: ${req.params.id}`),404))
  }

  await user.remove();
  res.status(200).json({
    success: true,
    message:"User deleted"
  })
})