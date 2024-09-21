const catchAsync = require('./../utils/catchAsync.js')
const Tour = require('./../model/tourModel.js');
const AppError = require('../utils/appError');

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
        return next(new AppError('No Tour Found with that ID', 404))
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