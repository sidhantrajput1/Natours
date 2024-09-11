const express = require('express')
const tourControllers = require('./../controllers/tourControllers.js')
// const {getAllTours, createNewTours, getTours, updateTours, deleteTours} = require('./../controllers/tourControllers.js')

const router = express.Router();
// router.param('id', tourControllers.checkId);

// router
//   .route('/top-5-cheap')
//   .get(tourControllers.aliasTopTours, tourControllers.getAllTours);


  
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createNewTours);
// app.get('/api/v1/tours/:id', getTours);
// app.patch('/api/v1/tours/:id', updateTours);
// app.delete('/api/v1/tours/:id', deleteTours);


router
   .route('/')
   .get(tourControllers.getAllTours)
   .post( tourControllers.createNewTours);

router
   .route('/:id')
   .get(tourControllers.getTours)
   .patch(tourControllers.updateTours)
   .delete(tourControllers.deleteTours);

module.exports = router;