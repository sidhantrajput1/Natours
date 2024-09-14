const User = require('./../model/userModel.js');
const catchAsync = require('./../utils/catchAsync.js')



exports.signup = catchAsync( async (req, res, next) => {

    const newUser = await User.create(req.body);

    res.status(201).json({
        status : 'Success',
        data : {
            user : newUser
        }
    })
});


