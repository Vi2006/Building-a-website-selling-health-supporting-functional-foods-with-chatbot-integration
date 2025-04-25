const Comment = require("../models/ComentModel");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Order = require("../models/OrderProduct");

const getComments = async (req, res) => {
  try {
    const { productId, userId, rating } = req.query;
    const query = {};

    if (productId) {
      query.productId = productId;
    }
    if (userId) {
      query.userId = userId;
    }
    if (rating) {
      query.rating = rating;
    }

    const rates = [];
    for (let i = 1; i <= 5; i++) {
      // Đếm số lượng bình luận có rating tương ứng cho productId
      const count = await Comment.countDocuments({
        productId: productId,
        rating: i,
      });
      rates.push(count);
    }

    const data = await Comment.find(query).sort({
      createdAt: -1,
    });

    const dataWithNames = await Promise.all(
      data.map(async (item) => {
        const user = await User.findById(item.userId);
        return {
          ...item.toObject(),
          name: user?.name ? user.name : user.email,
        };
      })
    );

    return res.status(200).json({
      status: "Ok",
      data: dataWithNames,
      rates: rates,
    });
  } catch (err) {
    console.log("Fetching comment error: ", err);
    return res.status(500).json({
      error: err,
    });
  }
};

const createComment = async (req, res) => {
  try {
    let { productId, userId, content, rating, images, toId } = req.body;
    console.log("req.body", req.body);
    if (toId === "") {
      toId = null;
    }
    if (!productId || !userId || !content) {
      return res.status(400).json({
        message: "Vui long dien day du cac truong can thietthiet",
      });
    }
    const orders = await Order.find(
      { "orderItems.product": productId },
      { user: userId }
    );
    const comments = await Comment.find({ userId }, { productId });
    console.log("jdbw", comments.length, orders.length);
    if (orders.length === comments.length) {
      return res.status(404).json({
        message: "Bạn đã hết lượt bình luận",
      });
    }
    const product = await Product.findById(productId);
    if (product && orders.length) {
      const data = await Comment.create({
        productId,
        userId,
        content,
        rating,
        images,
        toId,
      });

      if (rating) {
        product.rating =
          (product.rating * product.votes + rating) / (product.votes + 1);
        product.votes = product.votes + 1;
        await product.save();
      }
      return res.status(200).json({
        message: "Tao moi mot binh luan thanh cong",
        data: data,
        product: product,
      });
    } else {
      return res.status(404).json({
        message:
          orders.length > 0
            ? "San pham ban dang comment hien da khong con"
            : "Bạn chưa mua sản phẩm này",
      });
    }
  } catch (err) {
    console.log("Creating comment error: ", err);
    return res.status(500).json({
      message: "Error",
      error: err,
    });
  }
};

module.exports = { getComments, createComment };
