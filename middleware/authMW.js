const User = require('../model/userModel');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const admin = require('../config/firebase-config');


const auth = async(req,res,next)=>{
    try{  
        const token = req.header('Authorization');
        if(token){
            token.replace('Bearer ','');
            const decodeValue = await admin.auth().verifyIdToken(token);
            const result =jwt.verify(token,process.env.SECRET_KEY_TOKEN);
            //console.log(result);
            if(result || decodeValue){
                if(result){
                    req.user = await User.findById(result._id);
                }else{
                    const isUserRegistered = await User.findOne({'email':decodeValue.email});
                    if(isUserRegistered)
                        req.user = isUserRegistered;
                    else{
                        const newUser = new User({'email':decodeValue.email,'photoUrl':decodeValue.picture,'name':decodeValue.name});
                        await newUser.save();
                    }
                }
             return next();  
            }
            return res.json({'message':'Token is not valid.'});
        }
        else{
            throw createError(400,'UnAuthorized.');
            //res.json({message:'Authorization must!'})
        }


    }catch(err){
        next(err);
    }
}
module.exports =auth