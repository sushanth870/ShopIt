const Product = require("../models/product");

const ErrorHandler = require("../utils/errorHandler");

const APIFeatures = require("../utils/apiFeatures");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const product = require("../models/product");

// To add products => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products => /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  

  const productsPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
  let products = await apiFeatures.query;
  let filteredProductsCount = products.length;
  apiFeatures.pagination(productsPerPage);
  products = await apiFeatures.query;

    res.status(200).json({
      success: true,
      productsCount,
      productsPerPage,
      filteredProductsCount,
      products,
    });

 
});

//get single products => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id); //req.params.id takes parameter from url (see above comment)

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
    // res.status(404).json({
    //   success: false,
    //   message: "product not found",
    // });
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//update product=> /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//Delete product =>  /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  product.remove(),
    res.status(200).json({
      success: true,
      message: "product is deleted sucessfully",
    });
});


//Create/Update review => /api/v1/reviews/
exports.createProductReview =catchAsyncErrors(async  (req,res,next)=>{

  const {
    rating,
    comment,
    productId
  }=req.body;

  const review={
    user: req.user._id, 
    name:req.user.name,
    rating: Number(rating),
    comment
  }

  const product = await Product.findById(productId);
  
  const isReviewed = product.reviews.find(
    r=>r.user.toString()===req.user._id.toString()
  );

  if(isReviewed) {
    // product.reviews.forEach(review=>{
    //   if(review.user.toString()===req.user._id.toString()){
    //     review.comment=comment;
    //     review.rating=rating;
        isReviewed.comment=req.body.comment;
        isReviewed.rating=req.body.comment;
      // }
    // }
    // )
  }
    else
    {
        product.reviews.push(review);
        product.numofReviews = product.reviews.length;
    }
    product.ratings=product.reviews.reduce((acc,items)=>items.rating+acc,0)/product.reviews.length;
    await product.save({validateBeforeSave: false});
  
    res.status(200).json({
      success:true,
  
    })
  


})

//Get product review => /api/v1/product/reviews/
exports.getProductReview=catchAsyncErrors(async (req,res,next)=>{
    const product=await Product.findById(req.query.id);


    res.status(200).json({
      success: true,
      review: product.reviews
    })
})

//delete product review =>/api/v1/review?productId= & id=

exports.deleteReviews=catchAsyncErrors(async (req, res, next) => {
    const product=await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(rev=>(
      rev._id.toString() !== req.query.id.toString()
    ));
      const numOfReviews = reviews.length;
    const ratings = product.reviews.reduce((acc,rev)=> acc=acc+rev.rating,0)/reviews.length

    await Product.findByIdAndUpdate(req.query.productId,{
      reviews,
      ratings,
      numOfReviews
    },{
      new: true,
      runValidators: true,
      useFindAndModify: false
    })

    res.status(200).json({ 
      success: true,
    })
})