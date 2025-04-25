const Product = require("../models/ProductModel");
const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      // rating,
      description,
      trademark,
      manufacturer,
      ingredients,
      // discount,
      expiredDate,
    } = req.body;
    if (
      !name ||
      !image ||
      !type ||
      !price ||
      !countInStock ||
      // !rating ||
      !description ||
      !trademark ||
      !manufacturer ||
      !ingredients ||
      // !discount ||
      !expiredDate
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await ProductService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productid = req.params.id;
    const data = req.body;
    if (!productid) {
      return res.status(200).json({
        status: "ERR",
        message: "The productid is required ",
      });
    }

    const response = await ProductService.updateProduct(productid, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productid = req.params.id;
    if (!productid) {
      return res.status(200).json({
        status: "ERR",
        message: "The productid is required ",
      });
    }

    const response = await ProductService.getDetailsProduct(productid);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productid = req.params.id;
    if (!productid) {
      return res.status(200).json({
        status: "ERR",
        message: "The productid is required ",
      });
    }

    const response = await ProductService.deleteProduct(productid);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required ",
      });
    }

    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const {
      limit,
      page,
      sort,
      search,
      filter,
      type = "vitamin",
      expiredDate,
    } = req.query;
    const response = await ProductService.getAllProduct(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      search,
      filter,
      type,
      expiredDate
    );
    console.log("type", expiredDate);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const thongKe = async (req, res) => {
  try {
    const data = await Product.aggregate([
      {
        $addFields: {
          isExpired: { $lt: ["$expiredDate", new Date()] },
        },
      },
      {
        $group: {
          _id: "$isExpired",
          count: { $sum: 1 },
          products: { $push: { name: "$name", expiredDate: "$expiredDate" } },
        },
      },
      {
        $project: {
          _id: 0,
          status: { $cond: ["$_id", "Đã hết hạn", "Còn hạn"] },
          count: 1,
          products: 1,
        },
      },
    ]);
    return res.status(200).json({ message: "Thong ke thanh cong", data: data });
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteMany,
  getAllType,
  thongKe,
};
