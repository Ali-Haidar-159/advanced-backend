"use strict";

// import all the packages

const express = require("express");

const {
  createTodos,
  getAllTodo,
  getSingleTodo,
  deleteTodo,
} = require("../controller/todo.controller");
const checkLogin = require("../middlewares/checkLogin.middlewares");

// create the router obj
const todoRouter = express.Router();

// create all the router
todoRouter.post("/create", checkLogin, createTodos);
todoRouter.get("/", checkLogin, getAllTodo);
todoRouter.get("/:id", checkLogin, getSingleTodo);
todoRouter.delete("/", checkLogin, deleteTodo);

// export codes
module.exports = todoRouter;
