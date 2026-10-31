"use strict"

// import all the packages 
import express from "express";
import multer from "multer";

import path from "path" ;

import { postUserSignup } from "../controller/user.controller.js";

// declaration part
const DESTINATION = "./asset/";


// configuration of multer 

let storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,DESTINATION);
    },
    filename : function(req,file,cb){
        // ali cv.pdf -> ali_cv_5564154154.pdf
        let fileExtension = path.extname(file.originalname);
        let customFileName = file.originalname.replace(fileExtension,"").split(" ").join("_")+"_"+ Date.now() + fileExtension;

        cb(null, customFileName);

    }
});

let upload = multer({
    storage : storage,
    limits : {
        fileSize : 100000000 
    },
    fileFilter : function(req,file,cb){
        
        if(file.fieldname === "avatar"){
            if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
                cb(null,true) ;
            }
            else{
                cb(new Error("Upload only .png or .jpg or .jpeg format images"));
            }
        }
        else if(file.fieldname === "doc"){
            if(file.mimetype === "application/pdf"){
                cb(null,true) ;
            }
            else{
                cb(new Error("upload only .pdf files"));
            }
        }
    }
});


const userRouter = express.Router()

userRouter.post("/signup",  upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "doc",
            maxCount: 1
        }
    ]), postUserSignup);


// export code 
export default userRouter;
