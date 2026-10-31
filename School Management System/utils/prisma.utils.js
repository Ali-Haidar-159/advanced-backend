// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 

const { PrismaClient } = require("@prisma/client");

let prisma = new PrismaClient()

// ===== exports code ===== 

module.exports = prisma