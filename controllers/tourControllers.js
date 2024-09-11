const fs = require('fs');
const Tour = require('./../model/tourModel.js');
const ApiFeatures = require('./../utils/apiFeatures.js');
// const { fail } = require('assert');

// const { match } = require('assert');


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



exports.getAllTours = async (req, res) => {
    try {

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

        
    } catch (error) {
        res.status(400).json({
            status : 'fail',
            message : error.message
        })
    }
}

exports.getTours = async (req, res) => {
    
    try {
        
        const tour = await  Tour.findById(req.params.id)
        // Tour.find({_id : req.params.id}) //  also used this method 
        
        res.status(200).json({
            status: 'success',
            results: tour.length,
            data: {
              tour
            }
        })
    
    } catch (error) {
        res.status(400).json({
            status : 'fail',
            message : error
        })
    }

}


exports.createNewTours = async (req, res) => {
    
    try {
        // const newTour = new Tour({})
        // newTour.save()
    
        const newTour = await Tour.create(req.body) 
        
    
        res.status(201).json({
            status : 'Success',
            data : {
                tour : newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status : 'fail',
            message : "Invaild data sent!"
        })
    }
}

exports.updateTours = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators :true
        })
        res.status(200).json({
            status : 'Success',
            data : {
                tours : tour
            }
        })
    } catch (error) {
        res.status(400).json({
            status : 'fail',
            message : error
        })
    }
}

exports.deleteTours = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id, req.body, {
            new : true
        })
        res.status(204)
        .json(
            {
                status : 'Success',
                data : null
            }
        )
    } catch (error) {
        res.status(400).json({
            status : 'fail',
            message : error
        })
    }
}


exports.getTourStats = async (req,  res) => {
    try {
        
        const stats = await Tour.aggregate([
            {
                $match : { ratingsAverage : { $gte : 4.5 } }
            },
            {
                $group : {
                    _id : null,
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

    } catch (error) {
        res.status(400).json({
            status : 'fail',
            message : error.message
        })
    }
}


exports.getMonthlyPlan = async (req, res) => {
    try {

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
        
    } catch (error) {
        res.status(400).json({
            status : 'fail',
            message : error.message
        })
    }
}