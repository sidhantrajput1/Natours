const jwt = require('jsonwebtoken')
const User = require('./../model/userModel.js');
const catchAsync = require('./../utils/catchAsync.js')
const AppError = require('./../utils/appError.js')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync( async (req, res, next) => {

    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);


    res.status(201).json({
        status : 'Success',
        token,
        data : {
            user : newUser
        }
    })
});

exports.login = catchAsync( async (req, res, next) => {
    const { email, password } = req.body

    // check if email and password is exist

    if(!email || !password) {
        return next( new AppError('Please provide email and password!', 400))
    }
    // check if user and password is correct
    const user = await User.findOne({ email }).select('+password');
    

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email and password', 401))
    }

    console.log(user)
    // If everything ok, send token to client
    const token = signToken(user._id)

    res.status(200).json({
        status : 'Success',
        token,
    })

})


exports.protect = catchAsync( async (req, res, next) => {

    next()
})