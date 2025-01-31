import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const generateToken = (userId) => {
  try {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Generate token");
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
};

export const protect = async (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      const token = req.header("Authorization")?.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ error: "No token provided" });
  }
};
