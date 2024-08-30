const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , 'A tour must have a name '],
        unique: true
    },
    duration : {
        type : Number,
        required : [true, 'A Tour must have a Duration']
    },
    maxGroupSize : {
        type : Number,
        required : [true , "A Tour must have a Group Size"]
    },
    difficulty : {
        type : String,
        required  : [true, 'A tour must have a difficulty']
    },
    ratingQuantity : {
        type : Number,
        default : 0
    },
    ratingsAverage : {
        type : Number,
        default : 4.5,
    },
    price : {
        type : Number,
        required : [true, 'A tour must have a price ']
    },
    priceDiscount : {
        type : Number
    },
    summary : {
        type : String,
        trim : true,
        required : [true , "A tour must hava a required"]
    },
    description : {
        type : String,
        trim : true
    },
    imageCover : {
        type : String,
        required : [true, 'A tour must have a Cover iamge']
    },
    image : [String],
    startDates  : [Date],
},{
    timestamps : true
}
)

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;