const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const watchListSchema  = require('./movieListModel');

const userSchema = mongoose.Schema({

    active:{
        type:Boolean,
        default:false
    },
    userName:{
        type:String,
        trim:true,
        maxLength: 30,
        minLength:3,
        lowercase:true,
    },
    name:{
        type:String,
        trim:true,
        maxLength: 30,
        minLength:3
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        trim:true,

    },
    description:{
        type:String,
        trim:true,
    },
    photoUrl:{
        type:String,
        trim:true,
    },
    bannerPhotoUrl:{
        type:String,
        trim:true,
    },
    followersCount:{
        type:Number
    },
    followingCount:{
        type:Number,
        min:0,
        default:0
    },
    postCount:{
        type:Number,
        min:0,
        default:0
    },
    watchedMoviesCount:{
        type:Number,
        min:0,
        default:0
    },
    watchedlistCount:{
        type:Number,
        min:0,
        default:0
    },
    followers: [
        { 
            type: mongoose.Schema.ObjectId, 
            ref: 'User' 
        },
    ],
    followings: [
        { 
            type: mongoose.Schema.ObjectId,
            ref: 'User' 
        },
    ],
    watchListTv:[
        watchListSchema,
    ],
    watchListMovie:[
        watchListSchema,     
    ],
    watchedListTv:[
        watchListSchema
    ],
    watchedListMovie:[
        watchListSchema     
    ]
  

},{
    timestamps:true,    
    toObject: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.__v;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.__v;
        }
    }
});

/*const schema = Joi.object({
    name: Joi.string().min(3).max(30).trim().allow(''),
    userName:Joi.string().min(3).max(30).trim().allow(''),
    email:Joi.string().trim().email().lowercase(),
    password:Joi.string().trim(),
    description:Joi.string().allow(''),
    photoUrl:Joi.string().allow(''),
    bannerPhotoUrl:Joi.string().allow(''),
    followersCount:Joi.number(),
    followingCount:Joi.number(),
    postCount:Joi.number(),
    watchedMoviesCount:Joi.number(),
    watchedlistCount:Joi.number(),
    followers:Joi.array().allow(null),
    followings:Joi.array().allow(null),
    watchedListMovie:Joi.array().allow(null),
    watchedListTv:Joi.array().allow(null),
    watchListMovie:Joi.array().allow(null),
    watchListTv:Joi.array().allow(null),
    userGender:Joi.string().allow(''),


});x

userSchema.methods.joiValidation = function(userObject){
    schema.required();
    return schema.validate(userObject);

};
userSchema.statics.joiValidationUpdate = function(userObject){
    return schema.validate(userObject);

};*/

userSchema.methods.generateToken = async function(){
    const loggedUser = this;
    const token =await jwt.sign({_id:loggedUser._id},process.env.SECRET_KEY_TOKEN,{expiresIn:process.env.TOKEN_EXPIRES_TIME});
    return token;


};

userSchema.statics.authentication = async function(email,inPassword){
    //const {error,value} = schema.validate({email,password:inPassword});
    const currentUser = await User.findOne({email:email});
    if(currentUser){
        if(currentUser.password === inPassword)
            return currentUser;
    }
    return null;
   


};
userSchema.methods.toAuthJSON = async function(){    
    return {
    _id: this.id,
    username: this.username,
    password:this.password,
    token: await this.generateToken(),
    };
};



const User = mongoose.model('user',userSchema);


module.exports = User;