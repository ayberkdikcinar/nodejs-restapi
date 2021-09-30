const User = require('../model/userModel');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const admin = require('../config/firebase-config');


const authCheck = async(req,res,next)=>{
    try{  
        let token = req.header('Authorization');
        const isFirebase = req.header('firebase');
        if(token){
            
            token=token.replace('Bearer ','');
            if(isFirebase!='0'){
                const decodeValue= await admin.auth().verifyIdToken(token);
                if(decodeValue){
                    const isUserRegistered = await User.findOne({'userID':decodeValue.uid});
                    if(isUserRegistered)
                        req.user = isUserRegistered;
                    else{
                        const newUser = new User({'email':decodeValue.email,
                        'photoUrl':decodeValue.picture,'name':decodeValue.name,'userID':decodeValue.uid});
                        await newUser.save();
                        req.user = newUser;
                    }
                    return next();
                }
            }
            else{
                console.log('im here2');
                const result =jwt.verify(token,process.env.SECRET_KEY_TOKEN);
                if(result){
                    req.user = await User.findById(result._id).slice('watchedListTv',0).slice('watchedListTv',0).slice('watchListMovie',0);
                    //;
                    return next();
                }
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
module.exports =authCheck