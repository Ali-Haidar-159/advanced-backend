"use strict"

// import all the packages
import mongoose from "mongoose";

// create user schema 

const todoSchema = new mongoose.Schema({

    title : {
        type : String,
        required : [true, "title is required"],
        trim : true ,
    },
    description : {
        type: String,
        required : [true, "description is required"],
        trim : true ,
    },
    user : {
        type : mongoose.Types.ObjectId,
        ref : "User_Details"
    }
},{timestamps: true}) ; // timestamps: true -> Automatically adds createdAt and updatedAt fields




const todoModel = mongoose.model("Todos",todoSchema);



// exports code 
export  {todoModel};

