const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authControllers.js');
// const reviewController = require('./../controllers/reviewController.js');

const router = express.Router();

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router
   .patch('/updateMyPassword', authController.protect ,authController.updatePassword)

router.get('/me', authController.protect, userController.getMe, userController.getUser)
router.patch('/updateMe', authController.protect, userController.updateMe)
router.delete('/deleteMe', authController.protect, userController.deleteMe)

router
   .route('/')
   .get(userController.getAllUsers)
   .post(userController.createUser)


router
   .route('/:id')
   .get(userController.getUser)
   .patch(userController.UpdateUser)
   .delete(
      authController.protect, 
      authController.restrictTo('admin', 'lead-guide'), 
      userController.deleteUser);


module.exports = router