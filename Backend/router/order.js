const express = require('express');
const router = express.Router();

const { isAuthenticatedUser, autharizeRole } = require("../middlewares/auth");

const {addOrder,getSingleOrder,myOrders,allorders,deleteOrder,updateOrder} = require("../controllers/orderController");
// const { route } = require('./product');

router.route('/order/new').post(isAuthenticatedUser,addOrder);

router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);

router.route('/orders/me').get(isAuthenticatedUser,myOrders);

router.route('/admin/orders').get(isAuthenticatedUser,autharizeRole('admin'),allorders)

router.route('/admin/order/:id').put(isAuthenticatedUser,autharizeRole('admin'),updateOrder)
                                .delete(isAuthenticatedUser,autharizeRole('admin'),deleteOrder)

module.exports = router;
 