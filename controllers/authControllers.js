const { promisify } = require('util');
const jwt = require('jsonwebtoken')
const User = require('./../model/userModel.js');
const catchAsync = require('./../utils/catchAsync.js')
const AppError = require('./../utils/appError.js');


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
    let token;
    // 1. getting token and it's there
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // console.log(token);

    if (!token) {
        return next(new AppError('Your are not logged in! please login to get access', 401))
    }

    // 2. validate token || varification token
    const decode = await promisify(jwt.verify)(token , process.env.JWT_SECRET);
    // console.log(decode);
    
    // check if user still exists 
    const currentUser = await User.findById(decode.id);
    if (!currentUser) {
        return next( new AppError('The User belonging to this toekn does no longer exits. ', 401))
    }

    // change if user change password after token was issued
    if (currentUser.changedPasswordAfter(decode.iat)) {
        return next(new AppError('User recently change password! Please login agian ', 401))
    }


    // Grant access to proctected route
    req.user = currentUser;
    next()

})


exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles['admin', 'lead-guide']. role='user'

        if (!roles.include(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action!', 403))
        }
        next();
    }
}

exports.forgotPassword = catchAsync( async (req, res, next) => {
    // 1. Get user based on posted email
    const user = await User.findOne( { email : req.body.email })

    if (!user) {
        return next( new AppError("There is no user with email address. ", 404))
    }

    // 2. generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave : false})

    // 3. send it to user email
})


exports.resetPassword = catchAsync((req, res, next) => {})