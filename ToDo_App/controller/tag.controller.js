"use strict";

// import all the packages

const createError = require("http-errors");

const prismaObj = require("../lib/prisma.lib");

// create all the controller

const getAllTags = async function (req, res) {
  try {
    const allTags = await prismaObj.tag.findMany();

    if (allTags) {
      return res.status(200).json({
        success: true,
        data: allTags,
      });
    } else {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }
  } catch (err) {
    console.log(err.message);
    throw createError(400, `Find error to find all the tags: ${err.message}`);
  }
};

// export codes
module.exports = getAllTags;
