const env=require('dotenv').config();
const User = require('../Model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const rendomString = require('randomstring');
// const nodemailer = require('nodemailer');




// For Sen mail
// const sendVerificationMail = (email, token, name, res) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     requireTLS: true,
//     auth: {
//       user: "rahul658541@gmail.com",
//       pass: process.env.MAIL_PASS
//     },
//   });

//   const mailOptions = {
//     from: "rahul658541@gmail.com",
//     to: email,
//     subject: "Reset Password",
//     html: `Dear ${name},<br><br>
//     You have requested to reset your password. Please use the following link to reset your password:
//     <a href="http://localhost:3000/reset_pass/?token=${token}">Reset Password</a>`,
//   };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.error("Error sending email:", err);
//       return res.status(500).json({ error: "Mail Server Error" });
//     }
//     console.log("Email sent:", info.response);
//     return res.status(200).json({ message: "Email sent successfully" });
//   });
// }





const CreateUser = async (req, res) => {
  try {
    const { name, email, password,phone,address } = req.body;


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // // Create a new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword , // Use the hashed password
      phone,
      address
    });

    // // Save the new user to the database
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
    const { email, password } = req.body;

    // Find user by email 
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5min' });

    // Log success message (optional)
    console.log("User logged in:", user);

    // Return token and user details
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const Admin=async(req,res)=>{
  res.status(200).json({message: " authenticated  Admin Access"})
}


// const Forget = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const user = await User.findOne({ email: email });

//     if (!user) {
//       return res.status(404).json({ error: "User Not Found" });
//     }
//     console.log(email)

//     const token = rendomString.generate({expiresIn:"5 minutes"})
//     const updateToken = await User.findOneAndUpdate(
//       { email: email }, // Filter criteria
//       { $set: { resetPasswordToken: token } }, // Update document
//       { new: true } // To return the updated document
//     );

//     console.log(updateToken);
//     res.status(200).json('Please check your mail to Reset Password0');

//     sendVerificationMail(user.email, token, user.name)


//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };



// const Reset = async (req, res) => {
//   try {
//     const token = req.query.token;
//     console.log(token);
//     const user = await User.findOne({ resetPasswordToken: token });
//     if (!user) {
//       return res.status(404).json({ error: "Invalid or expired token" });
//     }
    
//     const { password } = req.body;
//     console.log(password , token);
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Update user's password and clear the reset password token
//     user.password = hashedPassword;
//     user.resetPasswordToken = ''; // Clear the token
//     await user.save();

//     res.status(200).json({ message: "Password reset successfully" });
//   } catch (error) {
//     console.error("Error in reset password endpoint:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };






module.exports = {
  CreateUser,
  LoginUser,
  Admin
  // Forget,
  // Reset
}
