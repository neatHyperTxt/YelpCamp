const express = require('express');
const router = express.Router({mergeParams:true});
const {reviewSchema} = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Campground = require('../models/campground');
const validateReview = (req,res,next)=>
{
    const {error} = reviewSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

router.post('/',validateReview,catchAsync(async (req,res)=>
{
    const {id} = req.params;
    const foundCampground = await Campground.findById(id);
    const review = new Review(req.body.review);
    foundCampground.reviews.push(review);
    await review.save();
    await foundCampground.save();
    req.flash('success','Created A New Review');
    res.redirect(`/campgrounds/${id}`);
}));
router.delete('/:reviewId',catchAsync(async (req,res)=>
{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','Successfully Deleted Your Review!!!');
    res.redirect(`/campgrounds/${id}`);
}))
module.exports = router;
