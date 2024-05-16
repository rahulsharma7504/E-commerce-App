const express=require('express');
const userRoute=express();
userRoute.use(express.urlencoded({extended:true}));
const {Auth,isAdmin} =require('../Middleware/Auth')



const userController = require('../Controller/UserController');
userRoute.post('/register',userController.CreateUser);
userRoute.post('/forget',userController.Forget);
userRoute.post('/reset_pass',userController.Reset);
userRoute.post('/login',userController.LoginUser); 
userRoute.get('/admin',Auth,isAdmin,userController.Admin);

 

 

module.exports=userRoute 