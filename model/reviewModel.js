const mongoose = require('mongoose');
const Tour = require('./tourModel');
const { findByIdAndDelete, findByIdAndUpdate } = require('./userModel');

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

reviewSchema.index({ tour : 1, user : 1}, {unique : true})

reviewSchema.pre(/^find/, function(next)  {
    // this.populate({
    //     path : 'tour',
    //     select : 'name' 
    // }).populate({
    //     path : 'user',
    //     select : 'name photo'
    // })

    this.populate({
        path : 'user',
        select : 'name' 
    })

    next();
})


reviewSchema.static.calcAverageRatings = async function(tourId) {
    console.log(tourId);
    
    const stats = await this.aggregate([
        {
            $match : { tour :  tourId}
        },
        {
            $group : {
                _id : '$tour',
                nRating : { $sum : 1},
                avgRating : { $avg : '$rating'}
            }
        }
    ])
    console.log(stats); 
    if(stats.length > 0) {
    Tour.findById(tourId, {
        ratingsQuantity : stats[0].nRating, 
        ratingsAverage : stats[0].avgRating
    })
   }
}

reviewSchema.pre('save', function(next) {
    // this points to current review 
    this.constructor.calcAverageRatings(this.tour);
    next();

})

// findByIdAndDelete
// findByIdAndUpdate
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.rev = await this.findOne()
    console.log(this.rev);
    next();
})

reviewSchema.post(/^findOneAnd/ , async function(next) {
    // this.rev = await this.findOne() // Does not Work  here , query has already executed
    await this.rev.constructor.calcAverageRatings(this.rev.tour)
})

const Review = mongoose.model('Review' , reviewSchema);

module.exports = Review;