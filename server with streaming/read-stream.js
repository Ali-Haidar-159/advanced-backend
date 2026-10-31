"use strict"

// main code 

let fs = require("fs");

let myReadStream = fs.createReadStream("./data.txt","utf-8");

myReadStream.on("data",function(data){
    console.log(data);
});
