const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
//checking user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors( async (req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("You need to login to access this resource",401))
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
});

// Handeling Role 
exports.autharizeRole = (...roles) =>{
    return (req,res,next) => {
        
        //error 403:Forbidden
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`,403));
        }

        next();
}
};


