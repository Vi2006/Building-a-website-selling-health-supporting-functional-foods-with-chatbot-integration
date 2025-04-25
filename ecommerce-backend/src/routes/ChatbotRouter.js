const express = require("express");
const router = express.Router();
const Response = require("../models/ResponseModel"); // Đường dẫn đúng tới model

router.post("/", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await Response.findOne({
      question: { $regex: userMessage, $options: "i" },
    });

    if (response) {
      res.json({ answer: response.answer });
    } else {
      res.json({ answer: "Xin lỗi, tôi không hiểu bạn đang nói gì." });
    }
  } catch (err) {
    console.error("❌ Lỗi xử lý chatbot:", err);
    res.status(500).json({ answer: "Lỗi server." });
  }
});

module.exports = router;
