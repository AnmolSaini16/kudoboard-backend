import express from "express";
import {
  addCardToBoard,
  createBoard,
  deleteBoard,
  deleteCard,
  editCard,
  editDisplayName,
  getAllBoards,
  getBoard,
} from "../controllers/BoardController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Boards
router.post("/createBoard", verifyToken, createBoard);

router.post("/editDisplayName", editDisplayName);

router.get("/:id", getBoard);

router.get("/", verifyToken, getAllBoards);

router.delete("/deleteBoard", verifyToken, deleteBoard);

// Cards
router.post("/addCard", addCardToBoard);

router.post("/editCard", editCard);

router.delete("/deleteCard", deleteCard);

export default router;
