"use strict"

// main code 
// import all the packages 
let myServer = require("./app") ;

let PORT = 3000 ;

myServer.listen(PORT, function(){
    console.log(`The server is running at ${PORT}...`);
});