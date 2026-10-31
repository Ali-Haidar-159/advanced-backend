// ===== initial code =====

"use strict"

// ===== main code =====
let myServer = require("./app");
let chalk = require("chalk");
require("dotenv").config();

let port = process.env.PORT || 5000;
let designConsole = chalk.bgRed.bold;

myServer.listen(port,function(){
    console.log(designConsole(`Server is running at http://localhost:${port}...`));
});

