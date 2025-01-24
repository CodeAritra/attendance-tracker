import jwt from "jsonwebtoken";

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
