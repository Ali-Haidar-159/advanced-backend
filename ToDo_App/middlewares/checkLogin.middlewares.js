"use strict";

// import packages

const jwt = require("jsonwebtoken");

// create middlewares

function checkLogin(req, res, next) {
  try {
    const token = req.signedCookies.todo_cookie;
    if (!token) {
      return res.redirect("/auth/login");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;

    next();
  } catch (err) {
    console.log(err.message);
    res.clearCookie("todo_cookie");
    return res.redirect("/auth/login");
  }
}

// export codes
module.exports = checkLogin;
