const User = require('../model/userModel');
const createError = require('http-errors');


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
        const result = await User.findOne({'userID':req.params.id});
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
        const result=await User.findOneAndUpdate({'userID':req.user.userID},req.body,{new:true,runValidators:true})
        //const result = await User.findByIdAndUpdate(req.user._id,req.body,{new:true,runValidators:true});
        if(result){
            return res.status(200).json(result);
        }
        throw createError(404,'Patch operation could not performed on user id: '+req.user.userID);
        
    }catch(err){
        next(err);
    }
  
}

const deleteUser = async(req,res,next)=>{
    try{
        const result =await User.findOneAndRemove(req.user.userID);
        if(result){
            return res.status(200).json(result);
        }
        
        throw createError(404,'Delete operation could not performed on user id:'+req.user.userID);
    }catch(err){
        next(err);
    }
    
}

const followUser = async(req,res,next)=>{
 
    //console.log(userFollowing);
    if(req.user.userID==req.params.id) return res.status(200).json({message:'You can not follow yourself'});
    
    const alreadyFollowing = await req.user.followings.find((userId)=>{
        return userId==req.params.id;
    });

    const followedUser = await User.findOne(req.params.id);

    if(!alreadyFollowing){
        req.user.followings.push(req.params.id);
        await req.user.save();    
        followedUser.followers.push(req.user.userID);
        await followedUser.save();
        return res.status(200).json({message:"user has been followed",to:req.params.id,from:req.user.userID});   
    }
    else{
        const indexfollowing = req.user.followings.indexOf(req.params.id);
        const indexfollower =followedUser.followers.indexOf(req.user.userID);
        req.user.followings.splice(indexfollowing,1);
        await req.user.save();
        followedUser.followers.splice(indexfollower,1);
        await followedUser.save();
        return res.status(200).json({message:"user has been unfollowed",to:req.params.id,from:req.user.userID});   
    }
    
}


const addToList = async(req,res,next)=>{
    try{
        let response='';
        const isMovie = req.params.isMovie;
        const isWatchList = req.params.isWatchList;

        const user = await User.findOne(req.user.userID);
        
        const movieModel = {
            movieId:req.body.movieId,
            moviePosterUrl:req.body.moviePosterUrl,
            ownerRate:req.body.ownerRate
        };

        if(isMovie=='true'){ 
            if(isWatchList=='true') response= checkItemExistanceAndPush(user.watchListMovie,movieModel);   
            else response= checkItemExistanceAndPush(user.watchedListMovie,movieModel);           
        }
        else{
            if(isWatchList=='true')  response= checkItemExistanceAndPush(user.watchListTv,movieModel);          
            else response= checkItemExistanceAndPush(user.watchedListTv,movieModel);           
        }

        if(response=='already exist')return res.json({'message':response});

        const result = await user.save();
        
        if(result) return res.status(201).json({'message':true});
        else return res.status(400).json({'message':false});
        

    }catch(err){
        console.log('error abiiş:   '+err);
        return res.status(500).json({'message':false});
    }
}

const checkItemExistanceAndPush = function(myArray,movieModel){
    
    const response= myArray.filter((element)=>{
        return element.movieId==movieModel.movieId;     
    });
    if(response.length>0) return 'already exist';    
    else{
        myArray.push(movieModel);
        return true;
    }
}
/*const googleSignup = async (req, res, next) => {

    await res.status(201).json(req.user.toAuthJSON());
    return next();
};*/
module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    getCurrentUser,
    deleteUser,
    followUser,
    addToList

}