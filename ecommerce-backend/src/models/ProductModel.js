const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    image: { type: String },
    type: { type: String },
    price: { type: Number },
    countInStock: { type: Number },
    rating: { type: Number, required: false, default: 0 },
    description: { type: String },
    discount: { type: Number, default: 0 },
    // selled: { type: Number },
    trademark: { type: String },
    manufacturer: { type: String },
    ingredients: { type: String },
    votes: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    expiredDate: { type: Date },
    dathanhly: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
