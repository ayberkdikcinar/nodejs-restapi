const router = require('express').Router();
const userController = require('../controller/userController');
const authMiddleware = require('../middleware/authMW');
const createError = require('http-errors');
const User = require('../model/userModel');
///Kullanıcılar için REST işlemleri. (listAll, listOneById, Update, Delete, append)
//createErrorda sadece message alanına erişebiliyorum. Status code vs erişilmiyor.
router.get('/',userController.getAllUsers);
 ///bu admin kısmında olursa iyi olur.
// Ama takip eden insanları getirmek için bir fonk yazılmalı.

router.get('/me',authMiddleware,userController.getCurrentUser);

//router.get('/:id',userController.getUserById);

router.get('/bymail/:email',authMiddleware,userController.getUserByEmail);
router.post('/follow',authMiddleware,async (req,res,next)=>{
    try{

        const appendingUser = await User.find({email:req.body.email}); //new User(req.body);
        const result =await req.user.followers.push(appendingUser[0]);
        await req.user.save();
        if(result){
            console.log('User has been added to db');
            return res.status(200).json(result);
        }
        throw createError(404,'Post operation could not performed');
    }
    catch(err){
        next(err);
    }

});
router.patch('/me',authMiddleware,userController.updateUser);

router.post('/signup',userController.addUser); ///yani bi nevi sign up.

router.post('/login',userController.login);

router.delete('/me',authMiddleware,userController.deleteUser);


module.exports= router;

