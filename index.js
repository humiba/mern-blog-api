const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// ! Routers list
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");

// ! note: this line comes right after routers list
app.use(bodyParser.json());

// ! Using router
app.use(userRouter);
app.use(postRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// Connect to database
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connect to MongoDB Successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });
