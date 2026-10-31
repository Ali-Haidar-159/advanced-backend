"use strict";

// import all the packages

const express = require("express");

const { signupUser } = require("../controller/user.controller");

// create the router obj
const userRouter = express.Router();

// create all the router
userRouter.post("/signup", signupUser);

// export codes
module.exports = userRouter;
