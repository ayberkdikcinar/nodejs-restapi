const router = require('express').Router();
const postController = require('../controller/postController');
const authMiddleware = require('../middleware/authMW');


///login olmuş kullanıcın verilen sayıdan başlayarak güncel tarih sırasına göre 5 tane kendi postlarını getirir.
//post listesini ve son listelenen postun numarasını döndürür.
router.get('/me/:number',authMiddleware,postController.getMyPosts);

// takip ettiği kişilerin tüm postları arasından verilen sayıdan başlayarak en güncel 5 tanesini getirir.
//post listesini ve son listelenen postun numarasını döndürür. 
router.get('/followings/:number',authMiddleware,postController.getFollowingPosts);

/// login olmuş kullanıcının post atma işlemi
router.post('/',authMiddleware,postController.sendPost);



module.exports= router;