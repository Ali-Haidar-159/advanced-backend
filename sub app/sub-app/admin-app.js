"use strict"

// main code 

// require all the packages 
const express = require("express");

// sub app creation 
const adminApp = express(); //sub app for admin

adminApp.enable("case sensitive routing");

// request-response cycle for sub app
adminApp.get("/dashboard",function(req,res){
        return res.status(200).json({
            success : true,
            message : "This is ADMIN DASHBOARD page"
        });
});

adminApp.get("/settings",function(req,res){
        return res.status(200).json({
            success : true,
            message : "This is ADMIN SETTINGS page"
        });
});


// exports code 

module.exports = adminApp;
