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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
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
