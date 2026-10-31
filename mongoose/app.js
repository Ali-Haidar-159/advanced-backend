"use strict"

// import all the packages 
import express from "express"
import cors from "cors"
import morgan from "morgan"

import userRouter from "./router/user.router.js"
import todoRouter from "./router/todo.router.js"

// declaration part
const corsOptions = {
    origin : ["http://localhost:3000"],
    methods : ["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"] ,
    credentials : true
}

// create server 
const app = express();

// connect with server 
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(morgan("dev"));
app.use(cors(corsOptions));

app.use("/users",userRouter);
app.use("/todos",todoRouter);

// request-response cycle 
app.all("/",function(req,res){
    return res.status(200).json({
        success : true ,
        message : "HOME page"
    });
});

// some other middlewares 
app.use(function(req,res,next){
    return res.status(404).json({
        success : false ,
        message : "Page not found !",
        path : req.originalUrl
    });
});

app.use(function(err,req,res,next){

    return res.status(500).json({
        success : false,
        message : "Internal server error!",
        error : err.message

    });

});


// export code 

export default app ;