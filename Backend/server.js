const app = require('./app')

const connectDatabase = require('./config/database')

process.on('uncaughtException', err=>{
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down database due to uncaught exception ');
    process.exit(1);
})

const dotenv = require('dotenv');

dotenv.config({path:'Backend/config/config.env'})
connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})
// console.log(a)

// handle unhandled promis rejections
// process.on('unhandledRejection',err =>{
//     console.log(`Error: ${err.message}`);
//     console.log('shutting down the srver due to Unhandled promise Rejections');
//     server.close(()=>{ 
//         process.exit(1)
//     })
// })

// Handle Unhandled Promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise rejection');
    server.close(() => {
        process.exit(1)
    })
})

