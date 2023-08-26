import mongoose from "mongoose";

const BoardSchemma = new mongoose.Schema(
  {
    boardId: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    boardType: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },

    cards: [{ msg: { type: String }, madeBy: { type: String } }],
  },
  { timestamps: { createdAt: "createdAt" } }
);

export default mongoose.model("Board", BoardSchemma);
