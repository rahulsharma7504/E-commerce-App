const mongoose=require('mongoose');
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Category'
    },
    quantity:{
        type:Number,
        required:true,
    },
    shipping:{
        type:Boolean,
        required:true,
    }
},{timestamps:Date.now})

module.exports=mongoose.model("product", productSchema);