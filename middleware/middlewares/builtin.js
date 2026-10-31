"use strict"

// main code 

function writeLogger(log) {
    
        return function (req,res,next){

            if(log){

                let message = `${new Date().toString()} -${req.method} -${req.originalUrl}` ;

                console.log(message);

                next()
            }
            else {
                throw new Error ("this is an error");
            }
    }
    

}




module.exports = writeLogger