"use strict";

// import all the packages

const express = require("express");

const getAllTags = require("../controller/tag.controller");
const checkLogin = require("../middlewares/checkLogin.middlewares");

// create the router obj

const tagRouter = express.Router();

tagRouter.get("/", checkLogin, getAllTags);

// exports code
module.exports = tagRouter;
