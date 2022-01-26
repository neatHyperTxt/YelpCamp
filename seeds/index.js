const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
    console.log("Database Connected and Updated the Seeds File");
})


const sample = (arr) => arr[Math.floor(Math.random() * (arr.length))];
const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora aperiam ipsam vel quasi alias dolorem!`,
            price: Math.floor(Math.random() * 20) + 10
        })
        await camp.save();
    }
}
seedDb().then(() => {
    mongoose.connection.close();
})