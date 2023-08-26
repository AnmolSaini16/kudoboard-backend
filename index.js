import dotenv from "dotenv";
import express, { json } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://kudoboard.vercel.app/",
    "https://kudoboard-api.onrender.com",
  ],
  credentials: true,
};

//middlewares
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.use(json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/board", boardRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected to mongoDB");
  } catch (error) {
    throw error;
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connect();
  console.log(`App is Listening on PORT ${PORT}`);
});
