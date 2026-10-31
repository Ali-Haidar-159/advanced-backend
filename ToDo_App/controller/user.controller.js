"use strict";

// import all the packages
const crypto = require("crypto");

const createError = require("http-errors");
const prismaObj = require("../lib/prisma.lib");

// create the controllers

const signupUser = async function (req, res) {
  try {
    const { email, password, name } = req.body;

    const hashedPass = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const newUser = await prismaObj.user.create({
      data: {
        name,
        email,
        password: hashedPass,
      },
    });

    return res.status(201).redirect("/auth/login?created=true");
  } catch (err) {
    console.error(err.message);
    throw createError(400, `Find error to signup user : ${err.message}`);
  }
};

// export codes
module.exports = {
  signupUser,
};
