const express = require("express");
const morgan = require("morgan");
var cookieParser = require("cookie-parser");

const AppError = require("./utils/AppError");
const errorhandler = require("./controllers/error.controller");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const cartRoutes = require("./routes/cart.routes");

const app = express();

// set pug template and views

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// serving static files
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use(
  express.json({
    limit: "30kb",
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  console.log("request incoming");
  return res.status(200).json({
    status: "Ok",
    message: "Hello, world!",
  });
});

// consuming routes
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/cart", cartRoutes);

// handling routes that are not supported
app.use("*", (req, res, next) => {
  return next(new AppError(`${req.originalUrl} could not be found`, 404));
});

// handling errors globally
app.use(errorhandler);

module.exports = app;
