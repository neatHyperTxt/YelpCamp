const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body:{
        type:String
    },
    rating:Number
})
const Reviews = mongoose.model('Reviews',reviewSchema);
module.exports = Reviews;