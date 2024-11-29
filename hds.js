const express=require('express');
const app=express();

app.get('/',(req,res)=>{
    res.send('<h3>Hello World<h3/>');
});

app.listen(4000, () => {
    console.log('Server running at http://127.0.0.1:4000/');
});
