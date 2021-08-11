const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URL,{useNewUrlParser: true,
 useUnifiedTopology: true, useCreateIndex:true,useFindAndModify: false})
.then(()=>console.log('Db connection successfull'))
.catch(err=>console.log('db connection Error'+err));


//