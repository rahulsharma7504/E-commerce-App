const express=require('express');
const CategoryRoute=express();

CategoryRoute.use(express.urlencoded({extended:true}));

// const {Auth,isAdmin} =require('../Middleware/Auth')

const categoryController = require('../Controller/categoryController');

CategoryRoute.post('/create',categoryController.createCategory);

CategoryRoute.get('/all',categoryController.AllCategory);
CategoryRoute.get('/single/:id',categoryController.OneCategory);

CategoryRoute.delete('/delete/:id',categoryController.DeleteCategory);

CategoryRoute.put('/update/:id',categoryController.updateCategory); 

module.exports=CategoryRoute;