const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
        required:true,
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
        required:true,
        trim:true,

    },
    userGender:{
        type:String,
        trim:true,
        enum:['male','female']
    },
    description:{
        type:String,
        trim:true,
        //default:'This is description'
    },
    photoUrl:{
        type:String,
        //trim:true,
        //default:''
    },
    bannerPhotoUrl:{
        type:String,
        trim:true,
        default:''
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



const schema = Joi.object({
    name: Joi.string().min(3).max(30).trim(),
    userName:Joi.string().min(3).max(30).trim(),
    email:Joi.string().trim().email().lowercase(),
    password:Joi.string().trim(),
    description:Joi.string(),
    photoUrl:Joi.string(),
    bannerPhotoUrl:Joi.string(),
    followersCount:Joi.number(),
    followingCount:Joi.number(),
    postCount:Joi.number(),
    watchedMoviesCount:Joi.number(),
    watchedlistCount:Joi.number(),
    followers:Joi.array(),
    followings:Joi.array(),
    userGender:Joi.string()


});

userSchema.methods.joiValidation = function(userObject){
    schema.required();
    return schema.validate(userObject);

};

userSchema.methods.generateToken = async function(){
    const loggedUser = this;
    const token =await jwt.sign({_id:loggedUser._id},process.env.SECRET_KEY_TOKEN,{expiresIn:process.env.TOKEN_EXPIRES_TIME});
    return token;


};
userSchema.statics.joiValidationUpdate = function(userObject){
    return schema.validate(userObject);

};
userSchema.statics.authentication = async function(email,inPassword){
    const {error,value} = schema.validate({email,password:inPassword});
    if(!error){
        const currentUser = await User.findOne({email:email});
        if(currentUser){
            if(currentUser.password === inPassword)
                return currentUser;
        }
        return null;
    }
    throw error;


};


const User = mongoose.model('user',userSchema);

module.exports = User;