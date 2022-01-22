const express = require('express');
const app = express();
const mongoose = require('mongoose');
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

//routes

app.get('/',(req,res)=>
{
    res.render('home');
})
app.get('/campgrounds',async (req,res)=>
{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})


// listening on Port
app.listen(3000,()=>
{
    console.log("Listening On Port 3000");
})