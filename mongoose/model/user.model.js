"use strict"

// import all the packages
import mongoose from "mongoose";

// create user schema 

const userSchema = new mongoose.Schema({

    email : {
        type : String,
        required : [true, "email is required"],
        trim : true ,
    },
    password: {
        type: String,
        required : [true, "password is required"],
        trim : true ,
    },
    cgpa : {
        type : Number ,
        max : 4.00
    },
    department : {
        type : String,
        required : true,
        enum : ["CSE","EEE","CE","ME","TE"],
        trim : true 
    },
    todos : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Todos"
        }
    ]
},{timestamps: true}) ; // timestamps: true -> Automatically adds createdAt and updatedAt fields


userSchema.methods.getCSEUser =  function(){
        return mongoose.model("User_Details").find({"department":"CSE"});
    }

userSchema.statics.getEEEUser =  function(){
        return this.find({"department":"EEE"});
    }

userSchema.query.findTE = function(){
    return this.find({"department":"TE"});
}



const UserModel = mongoose.model("User_Details",userSchema);



// exports code 
export  {userSchema,UserModel};

