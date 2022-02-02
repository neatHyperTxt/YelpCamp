const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const {campgroundSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
    console.log('Database Connected');
})
const Campground = require('./models/campground');

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//routes
app.engine('ejs', ejsMate);


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
app.get('/', (req, res) => {
    res.render('home');
})
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))


app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})


app.post('/campgrounds',validateCampground,  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))


app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const found = await Campground.findById(id);
    res.render('campgrounds/show', { found });
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const found = await Campground.findById(id);
    res.render('campgrounds/edit', { found });
}))

app.put('/campgrounds/:id',validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const updated = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${updated._id}`);
}))


app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})
// Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No! Something Went Wrong';
    res.status(statusCode).render('error', { err });
})
// listening on Port
app.listen(3000, () => {
    console.log("Listening On Port 3000");
})