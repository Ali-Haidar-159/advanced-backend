"use strict"

// import all the packages


// all the controllers
const postUserSignup = function(req,res){

    try{

        res.status(201).json({
            success : true ,
            message : "User signup completed successfully"
        });

    }
    catch(err){
        res.status(400).json({
            success : false ,
            message : "Find error to signup user",
            error : err.message
        });
    }

}


// exports code 

export{postUserSignup}
