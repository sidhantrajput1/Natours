const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel')
// const validator = require('validator')


const tourSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , 'A tour must have a name '],
        unique: true,
        trim : true,
        maxLength : [40 , 'A tour name must have less and equal than 40 character'],
        minLength : [10 , 'A tour name must have more and equal than 10 character'],
        // validate : [validator.isAlpha, 'A tour name must only contain character']
    },
    slug : String,
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
        required  : [true, 'A tour must have a difficulty'],
        enum : {
            values : ['easy', 'medium', 'difficult'],
            message : 'Difficulty is either : easy , medium, difficult'
        }
    },

    ratingQuantity : {
        type : Number,
        default : 0
    },

    ratingsAverage : {
        type : Number,
        default : 4.5,
        min : [1, 'Rating must be above 1.0'],
        max : [5 , 'Rating must be below 5.0']
    },

    price : {
        type : Number,
        required : [true, 'A tour must have a price ']
    },

    priceDiscount : {
        type : Number,
        validate : function (val) {
            // this only points to current document on new document creation
            return val > this.price
        },
        message : 'Discount price ({VALUE}) should be below regular price'
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
    secretTour : {
        type : Boolean,
        default : false
    },
    startLocation : {
        //GeoJSON
        type : {
            type : String,
            default : 'Point',
            enum : ['Point']
        },
        coordinates : [Number],
        address : String,
        description : String
    },
    location : [
        {
            type : {
                type : String,
                default : 'Point',
                enum : ['Point']
            },
            coordinates : [String],
            address : String,
            description : String,
            day : Number
        }
    ],
    guides: [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'User'
        }
    ]
},
   {
       timestamps : true
   }, 
   {
       toJSON : { virtual : true },
       toObject : { virtual : true}
   }
)

const Tour = mongoose.model('Tour', tourSchema);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

// Document Middleware: runs before .save() and .create()

tourSchema.pre('save', function (next) {
    
    this.slug = slugify(this.name , {lower : true});
    next();

})

tourSchema.pre('save',async function(next) {
    const guidesPromises = this.guides.map(async el => User.findById(id));
    this.guides = await Promise.all(guidesPromises)
    next();
})

// tourSchema.pre('save', function(next) {
//     console.log('will save document....!');
//     next();
// })

// tourSchema.post('save' , function(doc, next ) {
//     console.log(doc);
//     next();
// })

// Query Middleware

tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour : { $ne : true} })
    this.start = Date.now();
    next()
})

tourSchema.post(/^find/, function( doc, next) {
    console.log(`Query Took : ${Date.now() - this.start}`);
    next()
})

// aggregate middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift( { $match : { secretTour : { $ne : true } } } );
    console.log(this.pipeline())
    next();

})

module.exports = Tour;