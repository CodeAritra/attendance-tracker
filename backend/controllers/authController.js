import User from "../models/user.js";
import Joi from "joi";
import { generateToken } from "../utils/jwtUtils.js";
import { comparePassword, hassPassword } from "../utils/passwordutils.js";

export const signup = async (req, res) => {
  // Define validation schema
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
  });

  // Validate the request body
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({success: false, message: error.details[0].message });

  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({success: false, message: "User already exists" });

    const hashedPassword = await hassPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token: token,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in creating user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    // Define validation schema
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30).required(),
    });

    // Validate the request body
    const { error } = schema.validate(req.body);
    if (error) {
      console.error("Validation Error:", error.details[0].message);
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find user in the database
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`Login failed: User not found (${email})`);
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.error(`Login failed: Incorrect password (${email})`);
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in logging in",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logout successful" });
};
