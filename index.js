import dotenv from "dotenv";
import express, { json } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";

dotenv.config();
const app = express();

// const corsOptions = {
//   origin: true, //included origin as true
//   credentials: true, //included credentials as true
//   allowedOrigins: ["http://localhost:3000", "https://kudoboard.vercel.app/"],
// };

app.use(
  cors({
    origin: "https://kudoboard.vercel.app/",
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "https://kudoboard.vercel.app/");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override, Set-Cookie, Cookie"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

//middlewares
app.use(json());
// app.use(cors(corsOptions));
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
