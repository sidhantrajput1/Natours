const crypto = require('crypto')
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

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOption = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly : true
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOption.secure = true
    }

    res.cookie('jwt', token ,cookieOption )

    user.password =  undefined

    res.status(201).json({
        status : 'Success',
        token,
        data : {
            user 
        }
    })
}

exports.signup = catchAsync( async (req, res, next) => {

    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);

    // const token = signToken(newUser._id);

    // res.status(201).json({
    //     status : 'Success',
    //     token,
    //     data : {
    //         user : newUser
    //     }
    // })
    
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
    createSendToken(user, 200, res)
    // const token = signToken(user._id)

    // res.status(200).json({
    //     status : 'Success',
    //     token,
    // })
    // next()
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


exports.resetPassword = catchAsync(async (req, res, next) => {

    // Get User based on the token 
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne( {PasswordResetToken : hashedToken, passwordResetExpires : {$gt : Date.now() }} )

    // if Token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError( "Token is Inavlid or has Expired ", 400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.PasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();


    // Update changePasswordAt property for the current user 

    // log in the user and senf jwt
    createSendToken(user, 200, res)
    // const token = signToken(user._id);

    // res.status(200).json({
    //     status : 'Success',
    //     token
    // })
})


exports.updatePassword = catchAsync(async (req, res, next) => {
    // Get User from collection
    const user = await User.findById(req.user._id).select("+password")

    // Check if POSTed Current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next( new AppError('Your current password is wrong.', 401))
    }

    // If so, update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate

    // Log user in, send jwt
    createSendToken(user, 200, res)
})