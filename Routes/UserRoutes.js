const express=require('express');
const userRoute=express();
userRoute.use(express.urlencoded({extended:true}));
const {Auth,isAdmin} =require('../Middleware/Auth')



const userController = require('../Controller/UserController');
userRoute.post('/register',userController.CreateUser);
userRoute.get('/bookings',userController.AllBookings);
userRoute.get('/all-users',userController.AllUsers);
userRoute.post('/forget',userController.Forget);
userRoute.delete('/delete-user/:id',userController.deleteUsers); 
userRoute.post('/reset_pass',userController.Reset);  
userRoute.post('/login',userController.LoginUser);  
userRoute.put('/profile',userController.ProfileUpdate); 
userRoute.get('/admin',Auth,isAdmin,userController.Admin);

 

 

module.exports=userRoute 