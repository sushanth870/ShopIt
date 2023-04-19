const express = require('express');
const router = express.Router();
const {isAuthenticatedUser,autharizeRole} = require('../middlewares/auth')
const {registerUser,updateUser,getUserDetails,allUsers,deleteUser,updateProfile,updatePassword,getUserProfile,userLogin,userLogOut,forgotPassword,resetPassword} = require('../controllers/authController');

router.route('/register').post(registerUser);

router.route('/login').post(userLogin);

router.route('/logout').get(userLogOut);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword)

router.route('/me').get(isAuthenticatedUser,getUserProfile);
router.route('/password/update').put(isAuthenticatedUser,updatePassword);
router.route('/me/update').put(isAuthenticatedUser,updateProfile);

router.route('/admin/users').get(isAuthenticatedUser,autharizeRole('admin'),allUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser,autharizeRole('admin'),getUserDetails)

router.route('/admin/user/:id').put(isAuthenticatedUser,autharizeRole('admin'),updateUser)
router.route('/admin/user/:id').delete(isAuthenticatedUser,autharizeRole('admin'),deleteUser)

module.exports = router;