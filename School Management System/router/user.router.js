// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 
let express = require("express");
let userRouter = express.Router();

const { postSignup, postLogin, getMe, postLogout, putUserRole, putUserDetails } = require("../controller/user.controller");

const requireSuperAdmin = (req, res, next) => {
    if (!req.session || req.session.isSuperAdmin !== true) {
        return res.status(403).json({
            success: false,
            message: "Only the super admin can edit all user fields."
        });
    }
    return next();
};

const requireAdminOrSuperAdmin = (req, res, next) => {
    const isAdmin = req.isAuthenticated && req.isAuthenticated() && req.user.role === "ADMIN";
    const isSuperAdmin = req.session && req.session.isSuperAdmin === true;
    if (!isAdmin && !isSuperAdmin) {
        return res.status(403).json({
            success: false,
            message: "Only admins or the super admin can change user roles."
        });
    }
    return next();
};

userRouter.post("/signup",postSignup);
userRouter.post('/login',postLogin);
userRouter.get("/me", getMe);
userRouter.post("/logout", postLogout);
userRouter.put("/:id/role", requireAdminOrSuperAdmin, putUserRole);
userRouter.put("/:id", requireSuperAdmin, putUserDetails);


// ===== exports code ===== 

module.exports = userRouter;