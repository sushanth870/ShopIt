const Order = require("../models/Order");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncErrors");
const { updateProduct } = require("./productController");
exports.addOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create( 
    {
    shippingInfo,
    user:req.user._id,
    orderItems,
    paymentInfo,
    paidAt: Date.now(),
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  }
    )

    res.status(200).json({
        success: true,
        order
    })
});

//get single route => /api/v1/order/:id

exports.getSingleOrder = catchAsyncError( async(req,res, next)=>{
  const order = await Order.findById(req.params.id).populate('user','name email')
  if(!order){
    return next( new ErrorHandler('No Order found with this ID',404))
  }

  res.status(200).json({
    success: true,
    order
  })

})
//Get logged in user orders => /api/v1/order/me
exports.myOrders = catchAsyncError( async(req,res, next)=>{
  const order = await Order.find({user:req.user.id})

  res.status(200).json({
    success: true,
    order
  })
  
})
//Get all orders received => /api/v1/admin/orders
exports.allorders=catchAsyncError( async(req,res,next)=>{
  const orders=await Order.find()
  let totalAmount=0;
  orders.forEach(order=>{
    totalAmount+=order.totalPrice
  })

  res.status(200).json({
    success:true,
    totalAmount,
    orders
  })
})


// update stocks and status of order => /api/v1/admin/order/:id
exports.updateOrder=catchAsyncError( async(req,res, next)=>{
     const order= await Order.findById(req.params.id)
      if(!order){
        return next(new ErrorHandler('this order is  not there',404))
      }
     if(order.orderStatus==='Delivered'){
       return next(new ErrorHandler('this order is already delivered',404))
     }

     order.orderItems.forEach(async item=>{
        await updateStockt(item.product,item.quantity)
     })

     order.orderStatus=req.body.status,
     order.deliveredAt = Date.now()
     order.save()

     res.status(200).json({
       success: true,
       order
     })


})

async function updateStockt(id,quantity){
  const product=await Product.findById(id)
  product.stock=product.stock - quantity
  await product.save({validateBeforeSave:false})
}


//To Delete Order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncError( async(req,res, next)=>{
  const order = await Order.findById(req.params.id)

  if(!order){
    return next( new ErrorHandler('No order found with this Id',404))
  }
  await order.remove()
  res.status(200).json({
    success: true,
    order
  })
  
})