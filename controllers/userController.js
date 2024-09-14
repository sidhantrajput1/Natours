const fs = require('fs')
const User = require('./../model/userModel.js');
const catchAsync = require('./../utils/catchAsync.js');



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


exports.getUser = (req, res) => {
    res.status(500).json({
        staus : 'error',
        message : 'This route can not yet defined 🤦‍♂️'
    })
}


exports.createUser = (req, res) => {
    res.status(500).json({
        staus : 'error',
        message : 'This route can not yet defined 🤦‍♂️'
    })
}
exports.UpdateUser = (req, res) => {
    res.status(500).json({
        staus : 'error',
        message : 'This route can not yet defined 🤦‍♂️'
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        staus : 'error',
        message : 'This route can not yet defined 🤦‍♂️'
    })
}

