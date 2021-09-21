const Post = require('../model/postModel');
const User = require('../model/userModel');
const createError = require('http-errors');


const getMyPosts = async (req,res,next)=>{
    ///tarihe göre verilen sayıya göre. 
    try{
        //const result = await Post.find({"owner":req.user._id}).limit(5).sort({'createdAt':-1}).skip(Number(req.params.number));
        const result = await Post.find({"owner":req.user._id}).limit(Number(req.params.number))
        .sort({'createdAt':-1}).where('createdAt').gte(req.params.date);

        if(result){
            const lastDate=result[(result.length)-1].createdAt;
            return res.status(200).json({result:result,sonGetirilenPostTarihi:lastDate});
        }
        throw createError(404,'there is no post found for user id: '+req.user.userID);
    }catch(err){
        next(err);
    }
};
const getFollowingPosts = async(req,res,next)=>{
    try{
        const user = await User.findOne(req.user.userID);
        
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

const getLimitedPostByUserId = async (req,res,next)=>{
    ///tarihe göre verilen sayıya göre. 
    try{

        const user = await User.findOne({'userID':req.params.userId});

        const result = await Post.find({"owner":user._id}).limit(Number(req.params.number))
        .sort({'createdAt':-1}).where('createdAt').gte(req.params.date);

        if(result){
            const lastDate=result[(result.length)-1].createdAt;
            return res.status(200).json({result:result,sonGetirilenPostTarihi:lastDate});
        }
        throw createError(404,'there is no post found for user id: '+user.userID);
    }catch(err){
        next(err);
    }
};

const getAllPostsByUserId = async(req,res,next)=>{
    try{
        const user = await User.findOne({'userID':req.params.userId});
    
        const result = await Post.find({"owner":user._id}).limit(Number(req.params.number)).sort({'createdAt':-1})
        .where('createdAt').gte(req.params.date);
        

        if(result){
            const lastDate=result[(result.length)-1].createdAt;
            return res.status(200).json({result:result,sonGetirilenPostTarihi:lastDate});
        }
        throw createError(404,'there is no post found for user id: '+user.userID);
    }catch(err){
        next(err);
    }

}
const sendPost = async (req,res)=>{
    try{
        const post = new Post(req.body);
        post.owner = req.user._id;
        const result =await post.save();
        if(result){
            console.log('Post has been added to db');
            return res.status(200).json(result);
        }
        throw createError(501,'adding post failed');
    }catch(err){
        next(err);
    }
    
};

module.exports = {
    sendPost,
    getFollowingPosts,
    getMyPosts,
    getAllPostsByUserId,
    getLimitedPostByUserId
}
