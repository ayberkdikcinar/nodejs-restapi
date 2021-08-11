
const errorHandling=((err,req,res,next)=>{
    //console.log('Error handling inside');
    return res.json(err.message);
    //return res.send('404 NOT FOUND');
});

const notFoundPage=((req,res)=>{
    //console.log('404 NOT FOUND');
    res.send('404 NOT FOUND');
});

module.exports.errorHandling =errorHandling;
module.exports.notFoundPage =notFoundPage; 