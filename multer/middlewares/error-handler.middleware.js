const errorHandler = function(err,req,res,next){

    return res.status(500).json({
        success : false,
        message : "Find internal server error!",
        error : err.message
    });

}


// export code 

export default errorHandler;
