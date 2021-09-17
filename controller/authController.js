
require('dotenv').config();
const User = require('../model/userModel');
const createError = require('http-errors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');



const login = async(req,res,next)=>{
    try{
    
        const user = await User.authentication(req.body.email,req.body.password);
        if(user && user.active==true){
            const token = await user.generateToken();
            
            return res.status(200).json({
                token,
                user
            });
        }else if(user && user.active ==false){
            throw createError(400,'Email is not verified');
        }
        else{
            throw createError(400,'Username or password is wrong');
        }   

    }catch(err){
        next(err);
    }
}

const register = async(req,res,next)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(user && user.active==true){
            return res.status(500).json({'message':'email is already in use'});
        }
        else if((user && user.active==false) || user==null){

            if(user){
                await User.findByIdAndRemove({_id:user._id});
            }
            const newUser = new User(req.body);
            const {error,value}=newUser.joiValidation(req.body);
            if(error){
                throw createError(400,error);
            }
            const result = await newUser.save();

            if(result){
                var response='mail has not been send';
                //using jsonwebtoken for mail
                const payload = {
                    id:newUser._id
                }
                const token = jwt.sign(payload,process.env.MAIL_SECRET_KEY_TOKEN,{expiresIn:'12h'});

                //Sending mail
                const url = process.env.SITE_URL+'verify?id='+token;

                let transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth:{
                        user:process.env.MAIL_ADDRESS,
                        pass:process.env.MAIL_PASSWORD
                    }
                })
                await transport.sendMail({
                    from:'Movieet application <info@movieet>',
                    to: newUser.email,
                    subject: 'Please verify your email',
                    text:'To verify your email, please click the given link:'+url
                },(error,info)=>{
                    transport.close();
                });
                return res.status(200).json({'email':result.email,'active':result.active,'info':'mail send'});  
                //console.log('User has been added to db');
                 
            }

            throw createError(404,'register operation could not performed');       
            
        }

    }
    catch(err){
        next(err);
    }  
}

const verifyEmail =async (req,res,next)=>{
    try{
        const userId= req.query.id;

        if(userId){
           jwt.verify(userId,process.env.MAIL_SECRET_KEY_TOKEN,async (e,decoded)=>{
            if(e){
                return res.status(500).send({'message':'token is not verified'});
            }
    
            const result= await User.findByIdAndUpdate({_id:decoded.id},{active:true});
            if(result){
                return res.status(201).send({'message':'true'});
            }
            return res.status(500).send({message:'false'}); 
           });     
        }
        else{
            return res.status(500).send({'message':'token does not exist'});
        }
    }
    catch(err){
        return res.send({message:err});

    }
   
}

module.exports ={
    login,
    register,
    verifyEmail
}