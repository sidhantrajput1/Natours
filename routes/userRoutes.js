const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authControllers.js');

const router = express.Router();

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forgotPassword', authController.forgotPassword)
router.post('/resetPassword', authController.resetPassword)

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