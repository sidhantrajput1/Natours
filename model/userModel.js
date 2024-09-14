const mongoose = require('mongoose');
const validator = require('validator')
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
        required : [true, 'A User must have a iamge']
    },
    password : {
        type : String,
        required : [true, 'Please Enter a Strong password'],
        minLength : 8
    },
    passwordConfirm : {
        type : true,
        required : [true, 'Please confirm your password']
    }
})


const User = mongoose.model('User', userSchema);

module.exports = User