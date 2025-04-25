//Nhap vao thong tin ca nhan va nhan nut dat hang

const Product = require("../models/ProductModel");
const Order = require("../models/OrderProduct");
const { default: mongoose } = require("mongoose");
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderItems, shippingAddress, totalPrice, user } = req.body;
    const order = new Order({
      orderItems,
      shippingAddress,
      totalPrice,
      user,
    });

    const savedOrder = await order.save({ session });
    for (const item of orderItems) {
      const product = await Product.findById(item.product).session(session); // Tìm sản phẩm trong transaction

      if (!product) {
        await session.abortTransaction(); // Hủy transaction nếu không tìm thấy sản phẩm
        return res.status(404).json({
          message: `Không tìm thấy sản phẩm với ID: ${item.productId}`,
        });
      }

      // Kiểm tra số lượng tồn kho
      if (product.countInStock < item.amount) {
        console.log("gvdhghqef", product.countInStock, item.amount);
        console.log("Product", product);
        await session.abortTransaction(); // Hủy transaction nếu không đủ số lượng
        return res.status(400).json({
          message: `Không đủ số lượng tồn kho cho sản phẩm ${product.name}  `,
        });
      } else {
        product.countInStock = product.countInStock - item.amount;
        product.sold = product.sold + item.amount;
      }

      // Lưu sản phẩm đã cập nhật
      await product.save({ session }); // Lưu sản phẩm trong transaction
    }

    await session.commitTransaction(); // Commit transaction nếu tất cả thành công
    res.status(201).json(savedOrder); // Trả về đơn hàng đã tạo
  } catch (error) {
    await session.abortTransaction(); // Hủy transaction nếu có lỗi
    console.error("Lỗi tạo đơn hàng:", error);
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: error.message });
  } finally {
    session.endSession(); // Kết thúc session
  }
};

// Luu y chua cap nhat lai so luong con lai cua san pham

const getOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    const query = {};

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    } else {
      query.user = userId;
      const data = await Order.find(query);
      return res.status(200).json({
        message: "Ok",
        data: data,
      });
    }
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json({
      message: "Loi o server",
    });
  }
};

const deleteOrders = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(200).json({
        status: "ERR",
        message: "The id is required ",
      });
    }

    const response = await Order.deleteOne({ _id: id });
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const data = await Order.find({}); // ✅ Dùng find({}) để lấy tất cả đơn hàng
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const duyethoadon = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Order.findOneAndUpdate(
      { _id: id },
      { isDelivereding: true }
    );
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const duyetthanhtoan = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Order.findOneAndUpdate({ _id: id }, { isPaid: true });
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getOrderGroup = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $match: {
          paymentMethod: { $in: ["zaloPay", "cod"] },
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          total_orders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          paymentMethod: "$_id",
          total_orders: 1,
        },
      },
    ]);
    return res.status(200).json(stats);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getDailyMoney = async (req, res) => {
  const { startDate, endDate } = req.body;
  if (!startDate || !endDate) {
    return res.status(404).json({
      message: "start and end date is required",
    });
  }
  try {
    const orderrr = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });
    console.log("orderr", orderrr);
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            product: "$orderItems.product",
            name: "$orderItems.name",
            price: "$orderItems.price",
          },
          amount: { $sum: "$orderItems.amount" },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          startDate: { $first: new Date(startDate) },
          endDate: { $first: new Date(endDate) },
          products: {
            $push: {
              product: "$_id.product",
              name: "$_id.name",
              price: "$_id.price",
              amount: "$amount",
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return res.status(200).json({
      data: dailySales,
      message: "Get order thanh cong",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      err: error,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  deleteOrders,
  getAllOrder,
  getOrderGroup,
  duyethoadon,
  duyetthanhtoan,
  getDailyMoney,
};
