"use strict"

// import all the packages 
import jwt from "jsonwebtoken";

function checkAuth (req,res,next){
    try{
        const secret_key = process.env.JWT_SECRET;
        const authHeader = req.headers['authorization'];
    
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access Denied: No token provided or invalid format.' });
        }
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token,secret_key);

        req.userData = {
            userId : payload.userId,
            email : payload.username
        }

        next()

    }
    catch(err){
        console.log(err);
        next("Authentication Failed!");
    }
}


// exports code 

export default checkAuth;
