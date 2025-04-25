const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

routes(app);

console.log("process.env.MONGO_DB:", process.env.MONGO_DB);

mongoose
  .connect(
    `mongodb+srv://myproject:${process.env.MONGO_DB}@cluster0.aqlpv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("Connect Db success");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
