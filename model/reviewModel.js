const mongoose = require('mongoose');

// review / rating / createdAt / ref to tour / ref to user
const reviewSchema = new mongoose.Schema(
    {
        review : {
            type : String,
            required : [true, "A review can't be empty"]
        },
        rating : {
            type : Number,
            required : [true],
            min : 1,
            max : 5
        },
        createdAt : {
            type : Date,
            default : Date.now()
        },
        tour : {
            type : mongoose.Schema.ObjectId,
            ref : 'Tour',
            required : [true, 'Review must be belong to Tour'],
        },
        user : {
            type : mongoose.Schema.ObjectId,
            ref : 'User',
            required : [true, 'Review must be belong to User']
        }
    },
    {
        toJSON : { virtual : true },
        toObject : { virtual : true}
    }
)

const Review = mongoose.model('Review' , reviewSchema);


reviewSchema.pre(/^find/, function(next)  {
    this.populate({
        path : 'tour',
        select : 'name' 
    }).populate({
        path : 'user',
        select : 'name photo'
    })

    next();
})

module.exports = Review;