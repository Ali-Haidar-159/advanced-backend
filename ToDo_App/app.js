"use strict";

// import all the packages

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const path = require("node:path");

const checkLogin = require("./middlewares/checkLogin.middlewares");

const todoRouter = require("./router/todo.router");
const userRouter = require("./router/user.router");
const loginRouter = require("./router/login.router");
const { getAllTodo } = require("./controller/todo.controller");
const tagRouter = require("./router/tag.router");

// declaration part

const corsOptions = {
  origin: `http://localhost:${process.env.PORT}`,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// create the server
const app = express();

// connect with server

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

app.use("/auth", loginRouter);
app.use("/todos", todoRouter);
app.use("/users", userRouter);
app.use("/tags", tagRouter);

// request-response cycle

app.get("/", checkLogin, getAllTodo);

// middlewares

app.use(function (req, res, next) {
  return res.status(404).json({
    success: false,
    message: "Page not found",
    path: req.originalUrl,
  });
});

app.use(function (err, req, res, next) {
  if (err.statusCode) {
    res.locals.statusCode = err.statusCode;
    res.locals.errorMessage = err.message;
    return res.render("error");
  } else {
    return res.render("error", {
      statusCode: 500,
      errorMessage: err.message,
    });
  }
});

// exports code

module.exports = app;
