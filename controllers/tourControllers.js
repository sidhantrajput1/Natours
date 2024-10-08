const fs = require('fs');
const Tour = require('./../model/tourModel.js');
// const ApiFeatures = require('./../utils/apiFeatures.js');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');
const Factory = require('./handlerFactory.js')

// create a checkBody middleware
// Check if body contains name and price property
// if not , send back 400 (bad request)
// Add it to send post handler stack 

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  };



exports.getAllTours = Factory.getAll(Tour)
exports.getTours = Factory.getOne(Tour, { path : 'reviews' });
exports.createNewTours = Factory.createOne(Tour);
exports.updateTours = Factory.updatOne(Tour);
exports.deleteTours = Factory.deleteOne(Tour);




exports.getTourStats = catchAsync( async (req,  res, next) => {

    const stats = await Tour.aggregate([
        {
            $match : { ratingsAverage : { $gte : 4.5 } }
        },
        {
            $group : {
                _id : { $toUpper : '$difficulty'},
                numTour : { $sum : 1},
                numRating : {$sum : '$ratingsQuantity'},
                avgRating : { $avg : '$ratingsAverage' },
                avgPrice : { $avg : '$price'},
                minPrice : { $min : '$price'},
                maxPrice : { $max : '$price'}
            }
        },
        
    ])
    console.log("agregation:", stats)
    res.status(200).json({
        status : 'Success',
        data : {
            stats
        }
    })
})


exports.getMonthlyPlan = catchAsync( async (req, res, next) => {

    const year = req.params.year * 1;
    console.log('year : ', year)
    const plan = await Tour.aggregate([
        {
            $unwind : '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte : new Date(`${year}-01-01`),
                    $lte : new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group : {
                _id : { $month  : '$startDates' },
                numTourStarts : { $sum : 1 },
                tours : {$push : '$name'}
            }
        },
        {
            $addFields : {
                month : '$_id'
            }
        },
        {
            $project  :{
                _id : 0
            }
        },
        {
            $sort : { numTourStarts : -1 }
        },
        {
            $limit : 12
        }
    ])
    console.log('plan : ', plan)
    res.status(200).json({
        status : 'Success',
        data : {
            plan
        }
    })
})




// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-distance?distance=233&center=-40,45&unit=mi
// tour-distance/233/center/28.42929042304711, 77.50196015849835/unit/mi


exports.getToursWithin = catchAsync (async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    // const [lat , lng] = latlng.split(',');

    if (isNaN(distance)) {
        return next(new AppError('Please provide a valid distance as a number.', 400));
    }

    const [lat, lng] = latlng ? latlng.split(',') : [];

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if(!lat || !lng) {
        next( new AppError(
            'Please provide latitutr and longitude in the format lat,lng.',
            400
        ))
    }


    console.log(distance, lat, lng, unit);

    const tours = await Tour.find( { 
        startLocation: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius]
            }
        }
    } );

    res.status(200).json({
        status : 'Success',
        results : tours.length,
        data : {
            data : tours
        }
    })
})


exports.getDistances = catchAsync( async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng ? latlng.split(',') : [];

    const multiplier = unit === 'mi' ? 0.000621371 : 0.0001;


    if(!lat || !lng) {
        next( new AppError(
            'Please provide latitutr and longitude in the format lat,lng.',
            400
        ))
    }

    const distances = await Tour.aggregate([
        {
            $geoNear : {
                near : {
                    type : 'Point',
                    coordinates : [lng * 1, lat * 1]
                },
                distanceField : 'distance',
                distanceMultiplier : 0.001
            }
        },
        {
            $project : {
                distance : 1,
                name : 1
            }
        }
    ])

    res.status(200).json({
        status : 'Success',
        results : distances.length,
        data : {
            data : distances
        }
    })
})

/* 

exports.updateTours = catchAsync( async (req, res, next) => {
    
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators :true
    })

    if (!tour) {
        return next(new AppError('No Tour Found with that ID', 404))
    }

    res.status(200).json({
        status : 'Success',
        data : {
            tours : tour
        }
    })
})


exports.deleteTours = catchAsync( async (req, res, next) => {
    
    const tour = await Tour.findByIdAndDelete(req.params.id, req.body, {
        new : true
    })

    if (!tour) {
        return next(new AppError('No Tour Found with that ID', 404))
    }
    
    res.status(204)
    .json(
        {
            status : 'Success',
            data : null
        }
    )
})

exports.createNewTours = catchAsync (async (req, res, next) => {
    
    const newTour = await Tour.create(req.body) 
        
    res.status(201).json({
        status : 'Success',
        data : {
            tour : newTour
        }
    })
})


exports.getTours = catchAsync( async (req, res, next) => {
    
    const tour = await  Tour.findById(req.params.id).populate('reviews');
    // Tour.find({_id : req.params.id}) //  also used this method 

    if (!tour) {
        return next(new AppError('No Tour Found with that ID', 404))
    }
    
    res.status(200).json({
        status: 'success',
        results: tour.length,
        data: {
          tour
        }
    })
})


exports.getAllTours = catchAsync( async (req, res, next) => {
    // Execute query
    const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    const tours = await features.query
    
    res.status(200).json({
        status : 'success',
        results : tours.length,
        data : {
            tours
        }
    })
    console.log(tours)
})

*/
