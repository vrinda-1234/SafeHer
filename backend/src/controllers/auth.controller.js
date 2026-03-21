import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
  };
  
  const sendTokenResponse = (user, res) => {
    const accessToken = generateAccessToken(user._id);
  
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
  
  
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  };
export const registerUser = async (req, res) => { 
    const { name, email, password } = req.body;
     const userExists = await User.findOne({ email }); 
     if (userExists) return res.status(400).json({ message: "User already exists" }); 
     const salt = await bcrypt.genSalt(10); 
     const hashedPassword = await bcrypt.hash(password, salt); 
     const user = await User.create({ name, email, password: hashedPassword, });
     sendTokenResponse(user, res);
};
export const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user)return res.status(401).json({message:"Invalid credentials"});
    const isMatch=await bcrypt.compare(password,user.password);
    if (!isMatch) return res.status(401).json({message: "Invalid credentials" });
    sendTokenResponse(user, res);
};
export const logoutUser = (req, res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logged out" });
};