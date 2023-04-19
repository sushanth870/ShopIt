const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, autharizeRole } = require("../middlewares/auth");

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReview,
  deleteReviews
} = require("../controllers/productController");

//user and admin routes
router.route("/products").get(getProducts);  {/*isAuthenticatedUser, autharizeRole("admin"),*/}
router.route("/product/:id").get(getSingleProduct);

//only admin routes
router.route("/admin/product/new").post(isAuthenticatedUser, autharizeRole("admin"), newProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser, autharizeRole("admin"), updateProduct)
                                  .delete(isAuthenticatedUser, autharizeRole("admin"), deleteProduct);

router.route("/product/review").put(isAuthenticatedUser,createProductReview)

router.route("/reviews").get(isAuthenticatedUser,getProductReview)

router.route("/reviews").delete(isAuthenticatedUser,deleteReviews)



module.exports = router;
