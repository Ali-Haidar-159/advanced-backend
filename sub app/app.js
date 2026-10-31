"use strict"

// main code 

// require all the packages 
const express = require("express");

const http = require("http");

const adminApp = require("./sub-app/admin-app");

// server creation 
const app = express(); //main app
const myServer = http.createServer(app);

// connect with server 
app.enable("case sensitive routing");

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use("/admin",adminApp); //mounted in '/admin' path 

// request-response cycle for main app  
app.get("/",function(req,res){
    return res.status(200).json({
        success : true,
        message : "This is HOME page"
    });
});

app.get("/profile",function(req,res){
        return res.status(200).json({
            success : true,
            message : "This is PROFILE page"
        });
});

app.param("id",function(req,res,next,id){

    let allUsers = [
        {
            id : 101 ,
            name : "ali",
            age : 25
        },
        {
            id : 102 ,
            name : "fahmida",
            age : 23
        },
        {
            id : 103 ,
            name : "antora",
            age : 22
        },
    ] ; //demo user's for testing 

    let user = allUsers.find(function(item){
        return item.id == id ;
    });

    if(!user){
        return res.status(401).json({
            success : false,
            message : "User not found."
        });
    }

    req.userDetails = user;
    next();
    

});

app.get("/users/:id",function(req,res){

    let user = req.userDetails || {} ;

    res.status(200).json({
        success : true ,
        data : user 
    });

});


// exports code 
module.exports = myServer ;
