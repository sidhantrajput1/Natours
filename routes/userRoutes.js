const express = require('express');
const userController = require('./../controllers/userController.js');

const router = express.Router();

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