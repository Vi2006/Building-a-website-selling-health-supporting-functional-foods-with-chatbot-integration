const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/zalo-payment", PaymentController.zaloPayment);
router.post("/zalo-callback", PaymentController.zaloCallback);

module.exports = router;
