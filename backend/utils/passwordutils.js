import bcrypt from "bcrypt";

export const hassPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new error("Error in hashing password");
  }
};

export const comparePassword = async (candidatePassword, hashedPassword) => {
  try {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  } catch (error) {
    throw new error("Error in comparing hassed password");
  }
};
