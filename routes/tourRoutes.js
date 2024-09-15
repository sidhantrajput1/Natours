const express = require('express')
const tourControllers = require('./../controllers/tourControllers.js');
const authController = require('./../controllers/authControllers.js');
// const {getAllTours, createNewTours, getTours, updateTours, deleteTours} = require('./../controllers/tourControllers.js')

const router = express.Router();
// router.param('id', tourControllers.checkId);

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
   .post( tourControllers.createNewTours);

router
   .route('/:id')
   .get(tourControllers.getTours)
   .patch(tourControllers.updateTours)
   .delete(tourControllers.deleteTours);

module.exports = router;