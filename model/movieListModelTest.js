const movieListModel = require('./movieListModel');

const mongoose = require('mongoose');


const schema = mongoose.Schema({
    owner:{
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    watchListTv:[
        {
            movieListModel,
        }
    ],
    watchListMovie:[
        {
            movieListModel,
        }     
    ],
    watchedListTv:[
        {
            movieListModel,
        }
    ],
    watchedListMovie:[
        {
            movieListModel,
        }
           
    ]
});