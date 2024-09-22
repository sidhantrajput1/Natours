const express = require('express')
const tourControllers = require('./../controllers/tourControllers.js');
const authController = require('./../controllers/authControllers.js');
const reviewRouter = require('./../routes/reviewRoutes.js')
// const {getAllTours, createNewTours, getTours, updateTours, deleteTours} = require('./../controllers/tourControllers.js')

const router = express.Router();
// router.param('id', tourControllers.checkId);

// POST /tour/3q2njdk/reviews      
// GET /tour/3q2njdk/reviews      
// GET /tour/3q2njdk/reviews/89qha4d3

// router 
//    .route('/:tourId/reviews')
//    .post(
//       authController.protect,
//       authController.restrictTo('user'),
//       reviewController.createReview)


router.use('/:tourId/reviews', reviewRouter)



router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats)
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan)
  
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createNewTours);
// app.get('/api/v1/tours/:id', getTours);
// app.patch('/api/v1/tours/:id', updateTours);
// app.delete('/api/v1/tours/:id', deleteTours);


router
   .route('/')
   .get(authController.protect,  tourControllers.getAllTours)
   .post(
      authController.protect, 
      authController.restrictTo('admin lead-guide'), 
      tourControllers.createNewTours
   );

router
   .route('/:id')
   .get(tourControllers.getTours)
   .patch(tourControllers.updateTours)
   .delete(tourControllers.deleteTours);






module.exports = router;