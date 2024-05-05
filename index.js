const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors=require('cors');
const mongoose=require('mongoose');
mongoose.connect(`${process.env.MONGO_URL}e-commerce`).then(()=>{
    console.log('Database Connected');
})

const app = express();
app.use(express.json());


app.use(morgan('dev'));
app.use(cors()); 


const UserRoutes=require('./Routes/UserRoutes');
app.use('/user',UserRoutes);


const PORT = process.env.PORT // Use PORT from environment variable if available, otherwise default to 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
