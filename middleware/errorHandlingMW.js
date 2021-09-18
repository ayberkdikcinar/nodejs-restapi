
const errorHandling=((err,req,res,next)=>{
    //console.log('Error handling inside');
    return res.json({'message':err.message});
    //return res.send('404 NOT FOUND');
});

const notFoundPage=((req,res)=>{
    //console.log('404 NOT FOUND');
    //res.sendFile(path.join(__dirname+"/../public/404.html"));
    //res.end();
    return res.status(404).json({'message':'404 NOT FOUND'});
    //res.redirect('./404.html');
    //res.send('404 NOT FOUND');
});

module.exports.errorHandling =errorHandling;
module.exports.notFoundPage =notFoundPage; 