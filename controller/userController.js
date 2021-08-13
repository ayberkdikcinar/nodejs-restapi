const User = require('../model/userModel');
const createError = require('http-errors');

const login = async(req,res,next)=>{
    try{
    
        const user = await User.authentication(req.body.email,req.body.password);
        const token = await user.generateToken();
        if(user){
            return res.status(200).json({
                user,
                token
            });
        }else{
            throw createError(400,'Username or password is wrong');
        }   

    }catch(err){
        next(err);
    }
}
const getAllUsers = async (req,res,next)=>{
    try{
        const result=await User.find();
        if(result) return res.status(200).json(result);
        throw createError(404,'Find operation could not worked.');
        
    }
    catch(err){
        next(err);
    }
   
};
const getUserById =async(req,res,next)=>{
    try{
        const result = await User.findById(req.params.id);
        if(result){
            return res.status(200).json(result);
        }
        throw createError(404,'there is no user found by id: '+req.params.id);
    }catch(err){
        next(err);
    }
    
}
const getCurrentUser =async(req,res,next)=>{   
    res.json(req.user);
}
const getUserByEmail=async(req,res,next)=>{
    try{
        const result = await User.find({email:req.params.email});
        if(result){
            return res.status(200).json(result);
        }
        throw createError(404,'there is no user found by email: '+req.params.email);
    }catch(err){
        next(err);
    }
    
}
const updateUser=async(req,res,next)=>{
    try{

        const {error,value}=User.joiValidationUpdate(req.body);
        if(error){
            throw createError(400,error);
        }
        const result = await User.findByIdAndUpdate(req.user._id,req.body,{new:true,runValidators:true});
        if(result){
            return res.status(200).json(result);
        }
        throw createError(404,'Patch operation could not performed on user id: '+req.user._id);
        
    }catch(err){
        next(err);
    }
  
}
const addUser = async(req,res,next)=>{
    try{
        const appendingUser = new User(req.body);
        const {error,value}=appendingUser.joiValidation(req.body);
        if(error){
            throw createError(400,error);
        }
        const result =await appendingUser.save();
        if(result){
            console.log('User has been added to db');
            return res.status(200).json(result);
        }
        throw createError(404,'Post operation could not performed');
    }
    catch(err){
        next(err);
    }

    
}
const deleteUser = async(req,res,next)=>{
    try{
        const result =await User.findByIdAndRemove(req.user._id);
        if(result){
            return res.status(200).json(result);
        }
        
        throw createError(404,'Delete operation could not performed on user id:'+req.user._id);
    }catch(err){
        next(err);
    }
    
}

const followUser = async(req,res,next)=>{
 
    //console.log(userFollowing);
    if(req.user._id==req.params.id) return res.status(200).json({message:'You can not follow yourself'});
    
    const alreadyFollowing = await req.user.followings.find((userId)=>{
        return userId==req.params.id;
    });

    const followedUser = await User.findById(req.params.id);

    if(!alreadyFollowing){
        req.user.followings.push(req.params.id);
        await req.user.save();    
        followedUser.followers.push(req.user._id);
        await followedUser.save();
        return res.status(200).json({message:"user has been followed",to:req.params.id,from:req.user._id});   
    }
    else{
        const indexfollowing = req.user.followings.indexOf(req.params.id);
        const indexfollower =followedUser.followers.indexOf(req.user._id);
        req.user.followings.splice(indexfollowing,1);
        await req.user.save();
        followedUser.followers.splice(indexfollower,1);
        await followedUser.save();
        return res.status(200).json({message:"user has been unfollowed",to:req.params.id,from:req.user._id});   
    }
    
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    login,
    getCurrentUser,
    addUser,
    deleteUser,
    followUser,

}