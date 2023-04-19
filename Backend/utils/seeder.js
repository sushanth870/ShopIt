const Product = require('../models/product');
const connectDatabases = require('../config/database');
const product = require('../data/products');
const dotenv = require('dotenv');

dotenv.config({
    path:'Backend/config/config.env'
})

connectDatabases();

const seedProducts = async () =>{
    try{
        await Product.deleteMany();
        console.log('All products are deleted');
        await Product.insertMany(product);
        console.log('All products are inserted');
    }
    catch(err){
        console.log(err.message);
        process.exit();
    }
}

seedProducts();