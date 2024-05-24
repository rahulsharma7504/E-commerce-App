const env=require('dotenv').config();
const User = require('../Model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rendomString = require('randomstring');
const nodemailer = require('nodemailer');
const BookingModel=require('../Model/Booking');
const userModel = require('../Model/userModel');




// For Sen mail
const sendVerificationMail = (email, token, name, res) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    requireTLS: true,
    auth: {
      user: "rahul658541@gmail.com",
      pass: process.env.MAIL_PASS
    },
  });

  const mailOptions = {
    from: "rahul658541@gmail.com",
    to: email,
    subject: "Reset Password",
    html: `Dear ${name},<br><br>
    You have requested to reset your password. Please use the following link to reset your password:
    <a href="http://localhost:3000/reset_pass/?token=${token}">Reset Password</a>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.status(500).json({ error: "Mail Server Error" });
    }
    console.log("Email sent:", info.response);
    return res.status(200).json({ message: "Email sent successfully" });
  });
}





const CreateUser = async (req, res) => {
  try {
    const { formData} = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hashSync(formData.password, 12);

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email: formData.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // // Create a new user object
    const newUser = new User({
      name:formData.name, 
      email:formData.email,
      password: hashedPassword , // Use the hashed password
      phone:formData.phone,
      address:formData.address
    });

    // // // Save the new user to the database
    const savedUser = await newUser.save();

    // // Send a response indicating successful user registration
    res.status(201).json({ message: "User registered successfully", user: savedUser });

  } catch (error) {
    // Handle any errors
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const LoginUser = async (req, res) => {
  try {
    const { formData} = req.body;
console.log(formData);

    // Find user by email 
    const user = await User.findOne({ email: formData.email });
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(formData.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }
 
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5min' });

    // Log success message (optional)
    console.log("User logged in:", user);
 
    // Return token and user details
    return res.status(200).json({ token, user:{
      _id:user._id,
      name:user.name,
      email:user.email,
      phone:user.phone,
      address:user.address,
      role:user.role
    } });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const Admin=async(req,res)=>{
  res.status(200).json({message: " authenticated  Admin Access"})
}


const Forget = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    console.log(email)

    const token = rendomString.generate({expiresIn:"5 minutes"})
    const updateToken = await User.findOneAndUpdate(
      { email: email }, // Filter criteria
      { $set: { rendomtoken: token } }, // Update document
      { new: true } // To return the updated document
    );

    console.log(updateToken);
    res.status(200).json('Please check your mail to Reset Password0');

    sendVerificationMail(user.email, token, user.name)


  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const Reset = async (req, res) => {
  try {
    const token = req.query.token;
    console.log(token);
    const user = await User.findOne({ rendomtoken: token });
    if (!user) {
      return res.status(404).json({ error: "Invalid or expired token" });
    }
    
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password and clear the reset password token
    user.password = hashedPassword;
    user.rendomtoken = ''; // Clear the token
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in reset password endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




const ProfileUpdate = async (req, res) => {
  try {
    const { formData } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(formData.password, 12);

    // Find the user by email
    const user = await User.findOne({ email: formData.email });
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // Update the user details
    const updatedUser = await User.findOneAndUpdate(
      { email: formData.email },
      {
        $set: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: hashedPassword, // Use the hashed password
        },
      },
      { new: true } // Return the updated document
    );

    // Respond with the updated user details
    res.status(200).json({user:updatedUser});

  } catch (error) {
    // Handle any errors
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const AllBookings=async(req,res)=>{
  
  const Bookings=await BookingModel.find();
  res.status(200).json({message:"All Bookings",Bookings:Bookings})

}
const AllUsers = async (req, res) => {
  try {
    const { role } = req.query; // get role from query parameters
    let users;

    if (role !== undefined) {
      // If role is provided in the query, filter by role
      users = await User.find({ role: parseInt(role) }); // Ensure role is parsed to an integer
    } else {
      // If no role is provided, return all users
      users = await User.find({});
    }

    if (users.length > 0) {
      res.status(200).json({ message: "All Users", users: users });
    } else {
      res.status(404).json({ message: "Couldn't find users" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching users", error: error.message });
  }
};

const deleteUsers=async(req,res)=>{
  const {id}=req.params;
  
  const Bookings=await User.findByIdAndDelete(id);
  res.status(200).json({message:"User Deleted Successfullt"})

}






module.exports = {
  CreateUser,
  LoginUser,
  Admin,
  Forget,
  Reset,
  ProfileUpdate,
  AllBookings,
  AllUsers,
  deleteUsers
}
