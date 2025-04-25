const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/OrderController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create-order", ProductController.createOrder);
router.get("/get-all-order", ProductController.getAllOrder);
router.get("/:id", ProductController.getOrders);
router.delete("/:id", ProductController.deleteOrders);
router.post("/group", ProductController.getOrderGroup);
router.get("/status/:id", ProductController.duyethoadon);
router.get("/payment/:id", ProductController.duyetthanhtoan);
router.post("/money", ProductController.getDailyMoney);

module.exports = router;
