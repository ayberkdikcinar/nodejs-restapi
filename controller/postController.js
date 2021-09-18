const Post = require('../model/postModel');
const User = require('../model/userModel');
const createError = require('http-errors');


const getMyPosts = async (req,res,next)=>{
    ///tarihe göre verilen sayıya göre. 
    try{
        const result = await Post.find({"owner":req.user._id}).limit(5).sort({'createdAt':-1}).skip(Number(req.params.number));
        //const result = await Post.find({"owner":req.user._id}).limit(5).sort({'createdAt':-1}).lte({'createdAt':'10.09.2020'});
        if(result){
            return res.status(200).json({result:result,sonGetirilenPost:Number(req.params.number)+4});
        }
        throw createError(404,'there is no post found for user id: '+req.user._id);
    }catch(err){
        next(err);
    }
};
const getFollowingPosts = async(req,res,next)=>{
    try{
        const user = await User.findById(req.user._id);
        
        // takip ettiği kişilerin son attığı postların girilen sayıdan itibaren 5tanesini listeler.
        const result = await Post.find({"owner":{$in:user.followings}}).limit(5).sort({'createdAt':-1}).skip(Number(req.params.number));
      
        if(result){
            return res.status(200).json({result:result,sonGetirilenPost:Number(req.params.number)+4});
        }
        throw createError(404,'there is no post found');
    }catch(err){
        next(err);
    }
};

const sendPost = async (req,res)=>{
    
    const post = new Post(req.body);
    post.owner = req.user._id;
    const result =await post.save();
    if(result){
        console.log('Post has been added to db');
        return res.status(200).json(result);
    }
};

module.exports = {
    sendPost,
    getFollowingPosts,
    getMyPosts,
}
