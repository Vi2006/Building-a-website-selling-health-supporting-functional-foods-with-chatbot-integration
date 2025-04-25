const express = require("express");
const router = express.Router();
const ComentCotroller = require("../controllers/ComentCotroller");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/", ComentCotroller.createComment);
router.get("/", ComentCotroller.getComments);

module.exports = router;
