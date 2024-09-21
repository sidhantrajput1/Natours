const Review = require('./../model/reviewModel.js');
const catchAsync = require('./../utils/catchAsync.js')

exports.getAllReview = catchAsync( async (req, res) => {
    let filter = {}
    if ( req.params.tourId ) filter = { tour : req.params. tourId }
    const reviews = await Review.find();

    res.status(200).json({
        status : "Success",
        results : reviews.length,
        data : {
            reviews
        }
    });
});

exports.createReview = catchAsync( async (req, res) => {
    // Allow Nested Routes
    if(!req.body.tour) req.body.tour == req.params.tourId;
    if(!req.body.user) req.body.user == req.user.id;

    const newReview = await Review.create(req.body);

    res.status(201).json({
        status : "Success",
        data : {
            review : newReview
        }
    })
})