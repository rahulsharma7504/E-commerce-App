const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors=require('cors');
const mongoose=require('mongoose');
mongoose.connect(`${process.env.MONGO_URL}`,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log('Database Connected');
})
 
const app = express();         
app.use(express.json()); 
 

 
app.use(morgan('dev'));
app.use(cors()); 

app.use(express.static(path.join(__dirname, 'client/build')));
// For User API  
const UserRoutes=require('./Routes/UserRoutes');
app.use('/user',UserRoutes);

// For Category API
const CategoryRoutes=require('./Routes/Category');

app.use('/category',CategoryRoutes);

// For Product API

const ProductRoutes=require('./Routes/ProductRoute');

app.use('/product',ProductRoutes);

// For Order API

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT // Use PORT from environment variable if available, otherwise default to 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
