const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js');

const validateCampground = (req,res,next)=>
{
    const {error} = campgroundSchema.validate(req.body);    // Schema Acquired From Joi- campgroundSchema
    if(error)
    {
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else
    {
        next();
    }
}
// Routes

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds});
}))
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/',validateCampground,catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Successfully made a new Campground!!!'); 
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const found = await Campground.findById(id).populate('reviews');
    if(!found)
    {
        req.flash('error','Cannot Find That Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { found });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const found = await Campground.findById(id);
    if(!found)
    {
        req.flash('error','Cannot Find That Campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { found });
}))

router.put('/:id',validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const updated = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','Successfully Updated The Campground!!!!');
    res.redirect(`/campgrounds/${updated._id}`);
}))


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Your Campground!!!');
    res.redirect('/campgrounds');
})
module.exports = router;