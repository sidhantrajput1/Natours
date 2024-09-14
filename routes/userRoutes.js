const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authControllers.js');

const router = express.Router();

router.post('/signup', authController.signup)

router
   .route('/')
   .get(userController.getAllUsers)
   .post(userController.createUser)


router
   .route('/:id')
   .get(userController.getUser)
   .patch(userController.UpdateUser)
   .delete(userController.deleteUser);


module.exports = router