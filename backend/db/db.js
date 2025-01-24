import mongoose from "mongoose";

const connectDb = () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("MongoDb Connected");
      });
  } catch (err) {
    console.log("Error in mongoDb", err);
  }
};

export default connectDb;
