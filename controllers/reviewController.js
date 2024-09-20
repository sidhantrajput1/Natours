const Review = require('./../model/reviewModel.js');
const catchAsync = require('./../utils/catchAsync.js')

exports.getAllReview = catchAsync( async (req, res) => {
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
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status : "Success",
        data : {
            review : newReview
        }
    })
})