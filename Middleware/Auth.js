const dotenv = require('dotenv').config();
const JWT = require('jsonwebtoken');
const userModel = require('../Model/userModel');

// Load environment variables from .env file

// Authentication Middleware
const Auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Token is missing or invalid' });
    }
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET);
    if (decodedToken) {
      const user = await userModel.findOne({ _id: decodedToken.userId });
      if (user) {
        return res.status(200).json({ message: 'Success! Welcome to the JWT!' });
      }
    }
    next();

    return res.status(401).json({ message: 'User is not authenticated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Authorization Middleware for Admin Access
const isAdmin = async (req, res, next) => {
  try {
    const userData = await userModel.findOne({_id:req.user._id});
    
    if (!userData || userData.role !== 1) {
      return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error, message: 'Error in admin middleware' });
  }
};


module.exports = {
  Auth,
  isAdmin
};
