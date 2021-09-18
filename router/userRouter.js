const router = require('express').Router();
const userController = require('../controller/userController');
const authMiddleware = require('../middleware/authMW');
const createError = require('http-errors');
///Kullanıcılar için REST işlemleri. (listAll, listOneById, Update, Delete, append)
//createErrorda sadece message alanına erişebiliyorum. Status code vs erişilmiyor.
router.get('/',userController.getAllUsers);
 ///bu admin kısmında olursa iyi olur.
// Ama takip eden insanları getirmek için bir fonk yazılmalı.

router.get('/me',authMiddleware,userController.getCurrentUser);

//router.get('/:id',userController.getUserById);

router.get('/bymail/:email',authMiddleware,userController.getUserByEmail);

router.get('/byid/:id',authMiddleware,userController.getUserById);

router.post('/follow/:id',authMiddleware,userController.followUser);
router.patch('/me',authMiddleware,userController.updateUser);

router.delete('/me',authMiddleware,userController.deleteUser);


router.post('/addToList/:isMovie/:isWatchList',authMiddleware,userController.addToList);


module.exports= router;

