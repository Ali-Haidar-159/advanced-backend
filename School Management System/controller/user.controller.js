// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 
let prisma = require("../utils/prisma.utils");
let passport = require("passport");

// all the controllers 
let postSignup = async function(req,res){
    try{

        let {std_id,name,email,password,department} = req.body;

        if (![std_id,name,email,password,department].every(value => typeof value === "string" && value.trim())) {
            return res.status(400).json({
                success: false,
                message: "Student ID, name, email, password, and department are required"
            });
        }

        let newUser = await prisma.user.create({
            data :{
                std_id: std_id.trim(),
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                department: department.trim(),
                role: "STUDENT"
            },
            select: {
                id: true,
                std_id: true,
                name: true,
                email: true,
                department: true,
                cgpa: true,
                role: true
            }
        });

        return res.status(201).json({
            success : true ,
            message : "Student account created. Your administrator will assign your CGPA.",
            data : newUser
        });

    }
    catch(err){
        console.error("Find error to post signup : ",err.message)
        return res.status(400).json({
            success : false ,
            message : "Find error to signup the user",
            error : err.message
        });
    }
}


let postLogin = function (req,res,next){
    passport.authenticate("local",function(err,user,info){
        if(err){
            console.error("Passport auth error:", err);
            return res.status(500).json({
                success: false,
                message: "Authentication error",
                error: err.message
            });
        }

        if (!user){
            return res.status(401).json({
                success: false,
                message: info?.message || "Invalid email or password"
            });
        }

        req.logIn(user,function(loginErr) {

            if (loginErr) {
                console.error("Login session error:", loginErr);
                return res.status(500).json({
                    success: false,
                    message: "Login session failed",
                    error: loginErr.message
                });
            }

            const { password, ...userWithoutPassword} = user;
            const redirect = user.role === "ADMIN" ? "/admin" : "/student";

            return res.status(200).json({
                success: true,
                message: "Logged in successfully",
                redirect,
                data: userWithoutPassword
            });
        })
    })(req, res, next)
};

const getMe = async (req, res) => {
    try {
        if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const user = await prisma.user.findUnique({
            where: { 
                id: req.user.id 
            },
            
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { password, ...userWithoutPassword } = user;

        return res.status(200).json({
            success: true,
            data: userWithoutPassword
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get user session",
            error: err.message
        });
    }
};


const postLogout = (req, res) => {
    if (typeof req.logout === "function") {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Logout failed",
                    error: err.message
                });
            }
            if (req.session) {
                req.session.destroy((sessionError) => {
                    if (sessionError) {
                        return res.status(500).json({
                            success: false,
                            message: "Unable to end login session"
                        });
                    }
                    res.clearCookie("connect.sid");
                    return res.status(200).json({
                        success: true,
                        message: "Logged out successfully"
                    });
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Logged out successfully"
                });
            }
        });
    } 
    else {
        if (req.session) {
            req.session.destroy((sessionError) => {
                if (sessionError) {
                    return res.status(500).json({
                        success: false,
                        message: "Unable to end login session"
                    });
                }
                res.clearCookie("connect.sid");
                return res.status(200).json({
                    success: true,
                    message: "Logged out successfully"
                });
            });
        } 
        else {
            return res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });
        }
    }
};

const putUserRole = async (req, res) => {
    const { role } = req.body;
    if (role !== "STUDENT" && role !== "ADMIN") {
        return res.status(400).json({
            success: false,
            message: "Role must be STUDENT or ADMIN."
        });
    }

    if (req.user && req.params.id === req.user.id) {
        return res.status(400).json({
            success: false,
            message: "You cannot change your own role."
        });
    }

    try {
        const targetUser = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { id: true }
        });

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: targetUser.id },
            data: { role },
            select: { id: true, name: true, email: true, role: true }
        });

        return res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            data: updatedUser
        });
    } catch (err) {
        console.error("Unable to update user role:", err.message);
        return res.status(400).json({
            success: false,
            message: "Unable to update the user role."
        });
    }
};

const putUserDetails = async (req, res) => {
    const { std_id, name, email, department, cgpa, role, password } = req.body;
    if (![std_id, name, email, department].every(value => typeof value === "string" && value.trim())) {
        return res.status(400).json({
            success: false,
            message: "Student/staff ID, name, email, and department are required."
        });
    }
    if (role !== "STUDENT" && role !== "ADMIN") {
        return res.status(400).json({
            success: false,
            message: "Role must be STUDENT or ADMIN."
        });
    }
    if (cgpa !== null && cgpa !== undefined && cgpa !== "" && typeof cgpa !== "string" && typeof cgpa !== "number") {
        return res.status(400).json({
            success: false,
            message: "CGPA must be a number between 0 and 4."
        });
    }
    if (cgpa !== null && cgpa !== undefined && cgpa !== "") {
        const cgpaValue = Number(cgpa);
        if (!Number.isFinite(cgpaValue) || cgpaValue < 0 || cgpaValue > 4) {
            return res.status(400).json({
                success: false,
                message: "CGPA must be a number between 0 and 4."
            });
        }
    }
    if (password !== undefined && password !== "" && (typeof password !== "string" || password.length < 8)) {
        return res.status(400).json({
            success: false,
            message: "A new password must be at least 8 characters."
        });
    }

    const data = {
        std_id: std_id.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        department: department.trim(),
        role,
        cgpa: cgpa === "" || cgpa === undefined || cgpa === null ? null : String(Number(cgpa))
    };
    if (password) data.password = password;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.params.id },
            data,
            select: {
                id: true,
                std_id: true,
                name: true,
                email: true,
                department: true,
                cgpa: true,
                role: true
            }
        });
        return res.status(200).json({
            success: true,
            message: "User details updated successfully.",
            data: updatedUser
        });
    } catch (err) {
        console.error("Unable to update user details:", err.message);
        if (err.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        if (err.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "That email address is already used by another account."
            });
        }
        return res.status(400).json({
            success: false,
            message: "Unable to update user details."
        });
    }
};


// ===== exports code ===== 

module.exports = {
    postSignup,
    postLogin,
    getMe,
    postLogout,
    putUserRole,
    putUserDetails,
}
