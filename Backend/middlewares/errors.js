const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === 'DEVELOPMENT'){
    res.status(err.statusCode).json({
        success: false,
        error: err,
        errMessage: err.message,
        stack: err.stack
    })}
    if(process.env.NODE_ENV === 'PRODUCTION'){

        if(err.name === 'CastError')
        {
            const message = `Resource not found. Invalid: ${err.path}`
            err = new ErrorHandler(message,400)
        }
        if(err.name === 'ValidationError')
        {
            const message = Object.values(err.errors).map(val => val.message)
            err = new ErrorHandler(message,400)
        }
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            err = new ErrorHandler(message,400)
        }
        //Handling Mongoose duplicate key errors
       
        //Handling wrong JWT errror
        if(err.name === 'JsonWebTokenError'){
            const message = 'JSON Web Token is invalid.Try Again!!'
            err = new ErrorHandler(message,400)
        }
        //Handling expire JWT error
        if(err.name === 'TokenExpiredError'){
            const message = 'JSON Web Token is expired.Try Again!!'
            err = new ErrorHandler(message,400)
        }
        res.status(err.statusCode).json({
            success: false,
            error: err.message || 'Internal Server Error'
        })}
    }
