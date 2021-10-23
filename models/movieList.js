const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieListSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    movieList:[{ movie:String,rating:Number }]
})

module.exports = mongoose.model("movieList",movieListSchema);
