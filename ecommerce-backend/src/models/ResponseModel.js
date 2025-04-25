const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String },
});

const Response = mongoose.model("Response", chatbotSchema);

module.exports = Response;
