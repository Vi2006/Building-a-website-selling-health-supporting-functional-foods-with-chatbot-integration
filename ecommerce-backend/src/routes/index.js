const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const ComentRouter = require("./ComentRouter");
const PaymentRouter = require("./PaymentRouter");
const ChatbotRouter = require("./ChatbotRouter");
const ThanhlyRouter = require("./ThanhlyRouter");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/comment", ComentRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/chatbot", ChatbotRouter);
  app.use("/api/thanhly", ThanhlyRouter);
};

module.exports = routes;
