import express from "express";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/AuthController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", verifyToken, logoutUser);

router.get("/getCurrentUser", verifyToken, getCurrentUser);

export default router;
