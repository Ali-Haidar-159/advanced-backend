"use strict";

// import all the packages

const express = require("express");

const {
  getLogin,
  postLogin,
  getLogout,
} = require("../controller/login.controller");

// create the router obj

const loginRouter = express.Router();

// all the routers

loginRouter.get("/login", getLogin);
loginRouter.post("/login", postLogin);

loginRouter.get("/logout", getLogout);

// export codes

module.exports = loginRouter;
