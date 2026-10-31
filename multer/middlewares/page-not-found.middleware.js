const pageNotFound = function(req,res,next){

    return res.status(404).json({

        success : false,
        message : "Page not found",
        path : req.path 

    });

}


// export code 

export default pageNotFound;
