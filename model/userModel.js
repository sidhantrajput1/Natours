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
    password : {
        type : String,
        required : [true, 'Please Enter a Strong password'],
        minLength : 8
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
    }
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


const User = mongoose.model('User', userSchema);

module.exports = User