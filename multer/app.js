"use strict"

// import all the packages 
import express from "express" 
import cors from "cors"
import cookieParser from "cookie-parser"

import logger from "./middlewares/logger.middleware.js"
import errorHandler from "./middlewares/error-handler.middleware.js"
import pageNotFound from "./middlewares/page-not-found.middleware.js"
import userRouter from "./router/user.router.js"

// declaration part 
let corsOptions = {
    origin : ["http://localhost:3000"],
    credentials : true ,
    methods : ["GET","POST","PUT","DELETE"],
    allowedHeaders : ["Content-Type","Authorization"]
}

// create the server 
let app = express()

// connect with server 
app.use(express.urlencoded({extended : true})) ;
app.use(express.json());

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(logger(true));

app.use("/user",userRouter);

// request-response cycle 

app.route("/")
    .get(function(req,res){
        res.status(200).sendFile("index.html", { root: "./views" });
    })
    .post(function(req,res){
        res.status(200).send("HOME page post");
    });

// other middlewares 

app.use(pageNotFound);
app.use(errorHandler);


// exports code 

export default app;
