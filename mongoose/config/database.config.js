"use strict"

// import all the packages
import mongoose from "mongoose";

async function connectDB (connectionString){

    try{
        await mongoose.connect(connectionString);

        console.log("Database is connected successfully")
    }
    catch(err){
        console.log(err.message);
        throw new Error(`Find error to connect with database!.Error is : ${err.message}`);
    }

}


// exports code 

export default connectDB;
