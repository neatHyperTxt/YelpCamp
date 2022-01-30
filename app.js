const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error'));
db.once('open',()=>
{
    console.log('Database Connected');
})
const Campground = require('./models/campground');

const path = require('path');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
//routes
app.engine('ejs',ejsMate);


app.get('/',(req,res)=>
{
    res.render('home');
})
app.get('/campgrounds',catchAsync(async(req,res)=>
{
    const campgrounds = await Campground.find({}); 
    console.log(campgrounds);
    res.render('campgrounds/index',{campgrounds});
}))


app.get('/campgrounds/new',(req,res)=>
{
    res.render('campgrounds/new');
})


app.post('/campgrounds',catchAsync(async (req,res,next)=>
{
        const campground = new Campground(req.body.campground); 
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}))


app.get('/campgrounds/:id',catchAsync(async (req,res)=>
{
    const {id} = req.params;
    const found = await Campground.findById(id);
    res.render('campgrounds/show',{found}); 
}))

app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>
{
    const {id} = req.params;
    const found = await Campground.findById(id);
    res.render('campgrounds/edit',{found});
}))

app.put('/campgrounds/:id', catchAsync(async(req,res)=>
{
    const {id} = req.params;
    const updated = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${updated._id}`);
}))


app.delete('/campgrounds/:id',async (req,res)=>
{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})
// Error Handler
app.use((err,req,res,next)=>
{
    res.send('Oh Boy Something Went Wrong!!!');
})
// listening on Port
app.listen(3000,()=>
{
    console.log("Listening On Port 3000");
})