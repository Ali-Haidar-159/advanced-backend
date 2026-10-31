"use strict"

// import all the packages
import { UserModel } from "../model/user.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// all the controllers 

const postUserSingle = async function(req,res){

    try{

        const SALT_ROUNDS = 10;
        const encryptedPass = await bcrypt.hash(req.body.password,SALT_ROUNDS);
        
        const userData = {
            email : req.body.email ,
            password : encryptedPass,
            cgpa : req.body.cgpa,
            department : req.body.department
        };

        const newUser = await UserModel.create(userData);

        return res.status(201).json({
            success : true,
            message : "New user is created successfully!",
            data : newUser
        });
    }   
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success : false,
            message : "find error to create an user",
            error : err.message
        })
    }

} 


const postUserMultiple = async function(req,res){

    try{

        const allUserData = req.body ;
        const SALT_ROUNDS = 10;
        
        const userArray =  allUserData.map(async function(user){
            const encryptedPass = await bcrypt.hash(user.password,SALT_ROUNDS);
            
            const userData = {
                email : user.email ,
                password : encryptedPass,
                cgpa : user.cgpa,
                department :user.department
            };

            return userData;

        });

        const userDataArray = await Promise.all(userArray);
        const newUsers = await UserModel.insertMany(userDataArray);

        return res.status(201).json({
            success : true,
            message : "New users is created successfully!",
            data : newUsers
        });

    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success : false,
            message : "find error to create an users",
            error : err.message
        })
    }

} 

const postLoginUser = async function(req,res){

    try{

        const user = await UserModel.find({email : req.body.email});

        if(user && user.length>0){

            const isPassMatch = await bcrypt.compare(req.body.password,user[0].password);

            if(isPassMatch){

                const payload = {
                    userId : user[0]._id,
                    username : user[0].email
                };
                const secretKey = process.env.JWT_SECRET ;
                const options = {
                    expiresIn : "1h"
                };

                const token = jwt.sign(payload,secretKey,options);

                res.status(200).json({
                    success : true ,
                    access_token : token ,
                    message : "Login Successful"
                });

            }
            else{
                throw new Error ("Authentication Failed!.")
            }

        }
        else{
            throw new Error("Authentication Failed!");
        }

    }
    catch(err){
        console.log(err.message);

        return res.status(400).json({
            success : false,
            message : "find error to login",
            error : err.message
        });
    }

}

const getAllUsers = async function(req,res){

    try{
        const allUsers = await UserModel.find();

        return res.status(201).json({
            success : true,
            data : allUsers
        });
    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success : false,
            message : "find error to get all the users",
            error : err.message
        })
    }

} 


const getSingleUser = async function(req,res){

    try{

        const user = await UserModel.findById(req.params.id);

        return res.status(201).json({
            success : true,
            data : user
        });

    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success : false,
            message : "find error to get an user",
            error : err.message
        })
    }

} 


const updateUser = async function(req,res){

    try{

        const {name,age,department,cgpa} = req.body ;
        const userId = req.params.id ;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            { 
                $set: { 
                    name : name,
                    age: age,
                    department : department,
                    cgpa : cgpa                     
                } 
            },
            { 
                new: true,           // Return the modified document instead of the original
                runValidators: true  // Ensure the new data adheres to your schema rules
            }
        );

        return res.status(201).json({
                success : true,
                message : "User updated successfully",
                data : updatedUser
            });


            }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success : false,
            message : "find error to update an user",
            error : err.message
        })
    }

} 


const deleteUser = async function(req,res){

    try{

        const userId = req.params.id ;

        const deletedUser = await UserModel.findByIdAndDelete({
            _id : userId
        });

        return res.status(201).json({
                success : true,
                message : "User deleted successfully",
                data : deletedUser
            });

    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success : false,
            message : "find error to delete an user",
            error : err.message
        })
    }

} 


const getCSE = async function(req,res){

    try{
        const user = new UserModel();

        let users = await user.getCSEUser();

        return res.status(201).json({
            success : true,
            message : "Get all the users whose department is CSE",
            data : users
        });
    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success : false,
            message : "find error to get all the CSE users",
            error : err.message
        });
    }

}


const getEEE = async function(req,res){

    try{

        let users = await UserModel.getEEEUser();

        return res.status(201).json({
            success : true,
            message : "Get all the users whose department is EEE",
            data : users
        });
    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success : false,
            message : "find error to get all the EEE users",
            error : err.message
        });
    }

}

const getTE = async function(req,res){

    try{

        let users = await UserModel.find().findTE();

        return res.status(201).json({
            success : true,
            message : "Get all the users whose department is TE",
            data : users
        });
    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success : false,
            message : "find error to get all the TE users",
            error : err.message
        });
    }

}


// export codes 

export {postUserSingle,postUserMultiple,getAllUsers,getSingleUser,
    updateUser,deleteUser,getCSE,getEEE,getTE,postLoginUser}
