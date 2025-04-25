const express = require("express");
const router = express.Router();
const { authMiddleWare } = require("../middleware/authMiddleware");
const {
  CreateThanhLy,
  getAllThanhly,
} = require("../controllers/ThanhlyController");

router.post("/", CreateThanhLy);
router.get("/", getAllThanhly);

module.exports = router;
