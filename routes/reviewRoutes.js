const express = require('express');
const reviewController = require('./../controllers/reviewController.js');
const authController = require('./../controllers/authControllers.js')


const router = express.Router( { mergeParams : true } );

router
    .route('/')
    .get(reviewController.getAllReview)
    .post(
        // authController.protect, 
        // authController.restrictTo('user'), 
        reviewController.createReview)


router.route('/:id').patch(reviewController.updateReview).delete(reviewController.deleteReview)        


module.exports = router;