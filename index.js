const express = require('express');
require('./db/dbConnection');
require('dotenv').config();
const app = express();
const userRouter = require('./router/userRouter');
const postRouter = require('./router/postRouter');
const authRouter = require('./router/authRouter');
const error = require('./middleware/errorHandlingMW');


app.use('*/css',express.static('public/css'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/post',postRouter);
app.use(error.errorHandling);
app.use(error.notFoundPage);


app.listen(process.env.PORT,()=>{
    console.log('Server listening port:3000');
});