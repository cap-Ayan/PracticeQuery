const userModel = require('../model/userModel.js');
const Otp = require("../model/otpModel.js");
const nodemailer = require("nodemailer");
const { generateHashedPassword, generateToken,verifyPassword } = require('../utils/authantication.js');

const transporter = nodemailer.createTransport({
  host:"smtp-relay.brevo.com",
  port:587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});




exports.registerUser = async (req, res) => {

    const{userName,email,password}=req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        console.log(req.body);


        const newUser = new userModel({
            userName,
            email,
            password: await generateHashedPassword(password)
        });

        await newUser.save();

        const token = await generateToken({ userId: newUser._id });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })
      


        res.status(201).json({ success: true, message: 'User registered successfully' });

}
catch (error) {

    res.status(500).json({ success: false, message: 'Error registering user', error });
}

}

exports.loginUser = async (req, res) => {
  console.log("Login request received:", req.body);
    
  const { email, password, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    
    if (password && !otp) {
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid password" });
      }

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("OTP generated:", otpCode);


      // Save OTP to DB (expire in 5 minutes)
      await Otp.create({ email, otp: otpCode });

      console.log("OTP sent to email:", otpCode);


      // Send OTP via email
      await transporter.sendMail({
        from: `"ShopEase" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP code is ${otpCode}. It will expire in 5 minutes.`,
      });

      return res.json({ success: true, message: "OTP sent to your email" });
    }

    
    if (otp) {
      const validOtp = await Otp.findOne({ email, otp });
      if (!validOtp) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
      }

      // OTP is valid → delete it and generate token
      await Otp.deleteMany({ email });

      const token = await generateToken({ userId: user._id });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return res.json({
        success: true,
        message: "User logged in successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }

    // If neither password nor otp provided
    res.status(400).json({ success: false, message: "Missing credentials" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Error logging in user", error });
  }
};


exports.getUser = async (req, res) => {
     
    const user = req.user;
    if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, user });
}

exports.logoutUser = async (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'User logged out successfully' });
    

}

