const User = require('../model/userModel');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async(req,res,next)=>{
    try{  
        const token = req.header('Authorization');
        if(token){
            token.replace('Bearer ','');
            const result =jwt.verify(token,process.env.SECRET_KEY_TOKEN);
            console.log(result);
            req.user = await User.findById(result._id);
            next();
        }
        else{
            throw createError(400,'UnAuthorized.');
            //res.json({message:'Authorization must!'})
        }


    }catch(err){
        next(err);
    }
}
module.exports = authMiddleware;