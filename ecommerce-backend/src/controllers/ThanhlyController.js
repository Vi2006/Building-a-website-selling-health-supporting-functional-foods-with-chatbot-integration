const Product = require("../models/ProductModel");
const Thanhly = require("../models/ThanhlyModel");

const CreateThanhLy = async (req, res) => {
  const { productId, name, price, discount, reason } = req.body;
  if (!productId || !name || !price || !discount || !reason) {
    return res.status(404).json({ message: "Không đủ trường" });
  }
  try {
    const data = await Thanhly.create({
      productId,
      name,
      price,
      discount,
      reason,
    });
    const r = await Product.findOneAndUpdate(
      { _id: productId },
      { dathanhly: true, discount: discount },
      { new: true }
    );
    return res.status(200).json({ data: data, r: r });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getAllThanhly = async (req, res) => {
  try {
    const data = await Thanhly.find();
    return res
      .status(200)
      .json({ message: "get thanh ly thanh cong", data: data });
  } catch (error) {
    console.log("Err", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  CreateThanhLy,
  getAllThanhly,
};
