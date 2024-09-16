const crypto = require('crypto')
const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
// name, email, password, passwordConfirm , photo

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please tell us your name'],
    },
    email : {
        type : String,
        required : [true, 'Please Provide your email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, 'please provide a valid email']
    },
    photo : {
        type : String,
        default : "",
        // required : [true, 'A User must have a iamge']
    },
    role : {
        type : String,
        enum : ['user' , 'guide', 'lead-guide', 'admin'],
        default : 'user'
    },
    password : {
        type : String,
        required : [true, 'Please Enter a Strong password'],
        minLength : 8,
        select : false
    },
    passwordConfirm : {
        type : String,
        required : [true, 'Please confirm your password'],
        validate : {
            // this only works on Create and save
            validator:function (el) {
                return el === this.password
            },
            message : 'password are not the same'
        }
    },
    passwordChangeAt : Date,
    PasswordResetToken : String,
    passwordResetExpires : Date
})

userSchema.pre('save' ,async function (next) {
    // only runs this function if password is actually modified  
    if (!this.isModified('password')) {
        return next();
    }

    // hash the password with cost of 12
    this.password = await bcrypt.hash(this.password , 12);

    // Delete password failed
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {

    if (this.passwordChangeAt) {
        const changeTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000);

        console.log(changeTimestamp, JWTTimestamp)

        return JWTTimestamp < changeTimestamp;
    }

    // false means not change 
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.PasswordResetToken = crypto.createHash('sha512').update(resetToken).digest('hex');

    console.log({resetToken}, this.PasswordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User