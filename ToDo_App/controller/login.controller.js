"use strict";

// import all the packages
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const crypto = require("node:crypto");

const prismaObj = require("../lib/prisma.lib");

// all the controllers

const getLogin = function (req, res) {
  if (!req.user) {
    const userCreated = req.query.created || false;

    console.log("req.params.created : ", userCreated);

    if (userCreated) {
      return res.render("auth", {
        toast: {
          type: "success",
          message: "User created Successful",
        },
      });
    }
    return res.render("auth");
  } else {
    return res.redirect("/");
  }
};

const postLogin = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, "Email and password are required");
    }

    const user = await prismaObj.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw createError(401, "Invalid email or password");
    }

    const hashedPass = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hashedPass === user.password) {
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });

      res.cookie("todo_cookie", token, {
        maxAge: 5 * 60 * 60 * 1000, //5 hr in milliseconds
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        signed: true,
      });

      req.user = payload;

      return res.redirect("/");
    } else {
      throw createError(401, "Authentication Failed");
    }
  } catch (err) {
    console.log(err.message);
    throw createError(500, `Find server error : ${err.message}`);
  }
};

const getLogout = function (req, res) {
  res.clearCookie("todo_cookie");
  return res.redirect("/auth/login");
};

// export codes

module.exports = {
  getLogin,
  postLogin,
  getLogout,
};
