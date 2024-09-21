const fs = require('fs')
const User = require('./../model/userModel.js');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');
const Factory = require('./handlerFactory.js')

const filterObj = (obj , ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el]
        }
    })
    return newObj
}

exports.getMe = catchAsync ( async (req, res, next) => {
    req.params.id = req.user.id;
    next();
})

exports.getAllUsers = catchAsync( async(req, res, next) => {
    const users = await User.find()
    
    res.status(200).json({
        status : 'success',
        results : users.length,
        data : {
            users
        }
    })
    console.log(users)
})

exports.updateMe = catchAsync(async (req, res, next) => {
    // Create Error if user POSTs Passord data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for Password updates. please use /updateMyPassword route', 400))
    }

    // update user document
    const filterBody = filterObj(req.body , 'name', 'email')
    const updateUser = await User.findByIdAndUpdate(req.user.id , filterBody, {
        new : true,
        runValidators : true
    });
    

    res.status(200).json({
        status : 'Success',
        data : {
            user : updateUser
        }
    })

})

exports.deleteMe = catchAsync( async (req, res, next) => {
    await User.findByIdAndUpdate(req.body.id , { active : false})


    res.status(204).json({
        status : 'Success',
        data : null
    })
})


exports.getUser = Factory.getOne(User)


exports.createUser = (req, res) => {
    res.status(500).json({
        staus : 'error',
        message : 'This route can not yet defined 🤦‍♂️'
    })
}

// Do Not Update password with this
exports.UpdateUser = Factory.updatOne(User)
exports.deleteUser = Factory.deleteOne(User)