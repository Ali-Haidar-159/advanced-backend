"use strict";

// import all the packages

const { PrismaClient } = require("@prisma/client");

const prismaObj = new PrismaClient();

// export codes

module.exports = prismaObj;
