const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const path = require('path');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
    console.log('Database Connected');
})



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret:'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true, 
        expires:Date.now()+ 1000*60*60*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}))
app.use(flash());
app.engine('ejs', ejsMate);
app.use((req,res,next)=>
{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
//routes
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);


app.get('/', (req, res) => {
    res.render('home');
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