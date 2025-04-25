const axios = require("axios").default;
const moment = require("moment");
const Order = require("../models/OrderProduct");

const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
  refund_url: "https://sb-openapi.zalopay.vn/v2/refund",
};

const zaloPayment = async (req, res) => {
  const { _id, totalPrice } = req.body;

  const embed_data = {
    redirecturl: "http://localhost:3000/order",
    orderId: _id,
  };

  console.log("req.body", req.body);
  const items = [{}]; // Chua thong tin cac san pham trong order

  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: "user123",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: totalPrice,

    description: `Lazada - Payment for the order #${transID}`,
    // bank_code: "zalopayapp",
    callback_url:
      "https://982f-2401-d800-8d3-6719-cfc-b20c-97db-1127.ngrok-free.app/api/payment/zalo-callback",
  };

  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    console.log("result from api: ", result.data);
    return res.status(200).json(result.data);
  } catch (err) {
    console.log("error from api: ", err);
    return res.status(500).json(err);
  }
};

const zaloCallback = async (req, res) => {
  let result = {};

  console.log("co chay vao day ne");
  try {
    let dataStr = req.body.data;
    console.log("datastr", dataStr);
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      // console.log('id de cap nhat :', dataJson["embed_data"])

      try {
        const embedData = JSON.parse(dataJson["embed_data"]); // Phân tích chuỗi JSON
        const orderId = embedData.orderId; // Truy cập thuộc tính orderId
        const result = await Order.findOneAndUpdate(
          { _id: orderId },
          { isPaid: true, paymentMethod: "zaloPay" }
        );
        console.log(orderId); // In ra orderId
      } catch (error) {
        console.error("Lỗi khi phân tích JSON:", error);
      }

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};

module.exports = { zaloPayment, zaloCallback };
