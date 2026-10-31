// import all the packages
import express from "express"

import checkAuth from "../middlewares/auth.middleware.js";
import { createTodo, getAllTodo } from "../controller/todo.controller.js";

// create the router obj 
const todoRouter = express.Router();

// all the routers 
todoRouter.post("/create",checkAuth,createTodo);
todoRouter.get("/", getAllTodo);


// exports code 

export default todoRouter;