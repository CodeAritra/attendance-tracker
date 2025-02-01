import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attendanceRoute from "./routes/attendanceRoute.js";
import authRoute from "./routes/authRoute.js";
import connectDb from "./db/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

//mongoose connection
connectDb();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/auth", authRoute);
app.use("/attendance", attendanceRoute);

app.get("/", (req, res) => {
  res.send("Hiii");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
