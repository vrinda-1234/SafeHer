import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  };
  
  const sendTokenResponse = (user, res) => {
    const accessToken = generateAccessToken(user._id);
  
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days
    });
  
  
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  };
  export const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const userExists = await User.findOne({ email });
      if (userExists)
        return res.status(400).json({ message: "User already exists" });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
  
      sendTokenResponse(user, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    sendTokenResponse(user, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const logoutUser = (req, res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logged out" });
};