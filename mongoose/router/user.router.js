"use strict"

// import all the packages
import express from "express"

import { deleteUser, getAllUsers, getCSE, getEEE, getSingleUser, getTE, 
    postLoginUser, postUserMultiple, postUserSingle, updateUser } from "../controller/user.controller.js";
import checkAuth from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

// all the routes
userRouter.post("/signup", postUserSingle);
userRouter.post("/signup-multiple", postUserMultiple);
userRouter.post("/login", postLoginUser);

userRouter.get("/", checkAuth ,getAllUsers); // protected route
userRouter.get("/cse", getCSE); // using instance methods
userRouter.get("/eee", getEEE); // using statics methods
userRouter.get("/te", getTE); // using query helpers 

userRouter.get("/:id", getSingleUser);

userRouter.put("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

// exports code 

export default userRouter;

// https://www.facebook.com/groups/ditofficial