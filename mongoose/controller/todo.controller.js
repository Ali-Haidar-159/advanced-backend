"use strict"

// import all the packages
import { todoModel } from "../model/todo.model.js";
import { UserModel } from "../model/user.model.js";

// all the controllers 

const createTodo = async function(req,res){

    try{
        
        const todoData = {
            ...req.body ,
            user : req.userData.userId
        };

        const newTodo = await todoModel.create(todoData);

        await UserModel.updateOne({_id:req.userData.userId},{
            $push :{
                todos : newTodo._id
            }
        });

        return res.status(201).json({
            success : true,
            message : "New todo is created successfully!",
            data : newTodo
        });
    }   
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success : false,
            message : "find error to create a newTodo",
            error : err.message
        });
    }

} 


const getAllTodo = async function(req,res){

    try{
        const allTodo = await todoModel.find()
            .populate("user","email department -_id")
            .select({
                _id : 0,
                createdAt : 0,
                updatedAt : 0
            });

        return res.status(201).json({
            success : true,
            data_length : allTodo.length ,
            data : allTodo
        });
    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success : false,
            message : "find error to get all the Todo",
            error : err.message
        })
    }

} 



// exports code 

export {createTodo,getAllTodo}
