const fs = require('fs');
const Tour = require('../model/tourModel.js');


// create a checkBody middleware
// Check if body contains name and price property
// if not , send back 400 (bad request)
// Add it to send post handler stack 



exports.getAllTours = async (req, res) => {
    
    try {
        const tours = await Tour.find(req.body)
    
        res.status(200).json({
            status : 'success',
            result : tours.length,
            requestesAt : req.requestTime,
            data : {
                tours
            }
        })
    } catch (error) {
        res.status(400).json({
            status : 'fail',
            message : err
        })
    }
}

exports.getTours = async (req, res) => {
    
    try {
        
        const tour = await  Tour.findById(req.params.id)
        // Tour.find({_id : req.params.id}) //  also used this method 
        
        res.status(200).json({
            status : 'success',
            data : {
                tour
            }
        })
    
    } catch (error) {
        res.status.json({
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