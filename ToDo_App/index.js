"use strict";

// import all the packages
const chalk = require("chalk");
require("dotenv").config();

const app = require("./app");

// declaration part
const port = process.env.PORT || 5000;
const consoleDesign = chalk.bgRed.bold.italic;

app.listen(port, function () {
  console.log(
    consoleDesign(
      `${process.env.APPLICATION_NAME}  server is running @ http://localhost:${port}`,
    ),
  );
});
