const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const movieListSchema  = mongoose.Schema({

    movieId:{
        type:String,
        required:true,
        trim:true
    },
    moviePosterUrl:{
        type:String
    },
    ownerRate:{
        type:Number
    }
},
{timestamps:true,
    toObject: {
        transform: function (doc, ret) {
            delete ret.__v;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
        }
    }}
);

module.exports = movieListSchema;