const catchAsync = require('./../utils/catchAsync.js')
const AppError = require('../utils/appError');
const ApiFeatures = require('./../utils/apiFeatures.js');

exports.deleteOne = Model => catchAsync ( async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
        return next( new AppError( 'No Document find with that ID' , 404));
    }

    res.status(204).json({
        message : "Success",
        data : null
    })
})

exports.updatOne = Model =>  catchAsync (async (req, res, next ) => {
    
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators :true
    })

    if (!doc) {
        return next(new AppError('No doc Found with that ID', 404))
    }

    res.status(200).json({
        status : 'Success',
        data : {
            data : doc
        }
    })
})

exports.createOne = Model => catchAsync ( async (req, res, next ) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
        status : "Success",
        date : {
            data : doc
        }
    });
});

exports.getOne = (Model, popOption) => catchAsync (async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if(popOption) query = query.populate(popOption);
    const doc = await query;

    // const doc = await  Model.findById(req.params.id).populate('reviews');
    
    if (!doc) {
        return next(new AppError('No document Found with that ID', 404))
    }
    
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data : doc
        }
    })
})

exports.getAll = Model =>  catchAsync( async (req, res, next) => {
    // To Allow for nested Get Review on tour
    let filter = {}
    if ( req.params.tourId ) filter = { tour : req.params. tourId }
    

    // Execute query
    const features = new ApiFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    const doc = await features.query.explain();
    
    res.status(200).json({
        status : 'success',
        results : doc.length,
        data : {
            data : doc
        }
    })
})