const mongoose = require("mongoose");

const thanhlySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    price: { type: Number },
    discount: { type: Number },
    reason: { type: String },
    name: { type: String },
  },
  {
    timestamps: true,
  }
);
const Thanhly = mongoose.model("Thanhly", thanhlySchema);
module.exports = Thanhly;
