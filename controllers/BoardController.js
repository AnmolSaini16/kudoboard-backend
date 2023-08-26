import Board from "../modules/board.module.js";
import User from "../modules/user.module.js";
import jwt from "jsonwebtoken";

export const createBoard = async (req, res) => {
  try {
    const { boardId, displayName, boardType, recipient, createdBy } = req.body;
    // Create Baord
    const newBoard = await Board.create({
      boardId,
      displayName,
      boardType,
      recipient,
      cards: [],
    });
    //Associate newly created boardId to the User
    const user = await User.findById(createdBy);
    if (user) {
      await User.updateOne(
        { _id: user._id },
        { $push: { boardIds: boardId }, $set: { isCreator: true } }
      );
    } else {
      res.status(404).json({ error: "Error Occured: User Not found" });
      return;
    }
    res.status(200).json({ status: "Board Created", board: newBoard });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const getBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await Board.findOne({ boardId: id });
    if (board) {
      res.status(200).json(board);
    } else {
      res.status(404).send("Not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const getAllBoards = async (req, res) => {
  try {
    const { access_token } = req.cookies;
    const decodedToken = jwt.decode(access_token);
    const user = await User.findById(decodedToken.id);
    if (user) {
      const boards = await Board.find({
        boardId: { $in: user.boardIds },
      }).sort({ createdAt: "desc" });

      if (!boards.length) {
        res.status(200).json({ boards: [] });
      } else {
        res.status(200).json({ boards: boards });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.body;

    const [deletedBoard, userContainingDeletedBoard] = await Promise.all([
      Board.findOneAndDelete({ boardId: boardId }),
      User.updateOne(
        { boardIds: boardId },
        {
          $pull: { boardIds: boardId },
        }
      ),
    ]);

    if (!deletedBoard) {
      return res.status(404).json({ status: "Board not found" });
    }
    if (!userContainingDeletedBoard) {
      return res.status(404).json({ status: "User with board id not found" });
    }

    res.status(200).json({ status: "Board Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const addCardToBoard = async (req, res) => {
  try {
    const { boardId, msg, madeBy } = req.body;
    //Find board and push card to existing cards
    const board = await Board.findOneAndUpdate(
      { boardId: boardId },
      { $push: { cards: { msg, madeBy } } },
      { new: true }
    );
    if (!board) {
      res.status(404).json({ error: "Board not found" });
    } else {
      res.status(200).json({ status: "Card Added", board: board });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export const editCard = async (req, res) => {
  try {
    const { boardId, msg, madeBy, cardId } = req.body;
    // Find the board by boardId and the card by _id within the cards array
    const board = await Board.findOneAndUpdate(
      { boardId: boardId, "cards._id": cardId },
      {
        $set: {
          "cards.$.msg": msg,
          "cards.$.madeBy": madeBy,
        },
      },
      { new: true }
    );

    if (!board) {
      res.status(404).json({ error: "Board not found" });
    } else {
      // Find the updated card within the updated board
      const updatedCard = board.cards.find(
        (card) => card._id.toString() === cardId
      );
      if (!updatedCard) {
        res.status(404).json({ error: "Card not found" });
      } else {
        res.status(200).json({ status: "Card Edited", card: updatedCard });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { boardId, cardId } = req.body;
    const result = await Board.findOneAndUpdate(
      { boardId: boardId },
      {
        $pull: { cards: { _id: cardId } },
      }
    );

    if (result) {
      res.status(200).json({ status: "Card Deleted" });
    } else {
      res.status(404).json({ status: "Card not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
