import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import attendanceRoute from "./routes/attendanceRoute.js";
import connectDb from "./db/db.js";

const app = express();
const PORT = 5000;

//mongoose connection
connectDb();

app.use(express.json());
app.use(cors());

app.use("/attendance", attendanceRoute);

app.get("/", (req, res) => {
  res.send("Hiii");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
