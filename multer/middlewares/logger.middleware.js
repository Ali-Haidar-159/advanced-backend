
function logger(isLog=true){

    return function(req,res,next){

        if(isLog){
            let message  = `${new Date().toLocaleString()} -${req.method} -${req.originalUrl}` ;
            console.log(message);

            next();
        }
        else{
            throw new Error ("Find error to log the server activity.");
        }

    }

}



// export codes 

export default logger;

