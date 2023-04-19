const express =require('express');
const app = express();
const  errorMiddleware = require('./middlewares/errors.js')
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());

const products = require('./router/product');
const user = require('./router/user');
const  order = require("./router/order");
app.use('/api/v1',products);
app.use('/api/v1',user);
app.use('/api/v1',order);



app.use(errorMiddleware);

module.exports =app

 