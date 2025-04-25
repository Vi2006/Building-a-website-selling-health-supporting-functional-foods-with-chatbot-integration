const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    rating: { type: Number, default: 0, required: false },
    images: { type: Array, rquired: false, default: [] },
    toId: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
