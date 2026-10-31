"use strict"

// main code 

let EventEmitter = require("events") ;
let emitter = new EventEmitter()

emitter.on("ring", function(event){
    console.log("the bell is ringing");
    console.log(Object.values(event));
});

setTimeout(() => {
    emitter.emit("ring",{
        name : "Ali",
        age : 25
    }); 
}, 5000);