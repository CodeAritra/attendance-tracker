import mongoose from "mongoose";

const connectDb = () => {
  try {
    mongoose
      .connect("mongodb://localhost:27017/Attendance_tracker")
      .then(() => {
        console.log("MongoDb Connected");
      });
  } catch (err) {
    console.log("Error in mongoDb", err);
  }
};

export default connectDb;
