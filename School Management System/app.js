// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 
let express = require("express");
let swaggerUi = require("swagger-ui-express");
let cors = require("cors");
let morgan = require("morgan");
let passport = require("passport");
let session = require("express-session");
let MongoStore = require('connect-mongo').MongoStore;

require("./config/passport.config");
require("dotenv").config();

let http = require("http");
let path = require("path");

const swaggerDoc = require("./config/swagger.config");
const prisma = require("./utils/prisma.utils");
let requireRole = require("./middlewares/checkRole.middleware");

const userRouter = require("./router/user.router");

// declaration part

let corsOptions = {
    origin : ["http://localhost:5173","http://localhost:3000"],
    methods : ["GET","POST","PUT","DELETE"],
    allowedHeaders : ["Content-Type","Authorization"],
    credentials : true
}

const SUPER_ADMIN_USERNAME = "superadmin";
const SUPER_ADMIN_PASSWORD = "admin123";

// create server
let app = express();
let myServer = http.createServer(app);

// connect with server 
app.use(express.urlencoded({extended:false}));
app.use(express.json()) ;
app.use(express.static(path.join(__dirname,"static")));

app.set("trust proxy",1);
app.use(session({
    secret : process.env.SESSION_SECRET,
    saveUninitialized : true,
    resave : false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan("dev"));
app.use(cors(corsOptions));

app.set("view engine","ejs") ;
app.set("views",path.join(__dirname,"view"));

app.use("/apis",swaggerUi.serve,swaggerUi.setup(swaggerDoc));

app.use("/api/user",userRouter);

// request-response cycle 
app.get("/",function(req,res){
    return res.status(200).render("home");
});

app.get("/student", requireRole("STUDENT"), async (req, res, next) => {
    try {
        const student = await prisma.user.findUnique({
            where: { 
                id: req.user.id 
            },
            select: { std_id: true, name: true, email: true, department: true, cgpa: true }
        });
        if (!student) 
            return res.status(404).render("access-denied");
        return res.render("student-portal", { student });
    } 
    catch (err) {
        return next(err);
    }
});

app.get("/admin", requireRole("ADMIN"), async (req, res, next) => {
    try {
        const students = await prisma.user.findMany({
            where: { role: { in: ["STUDENT", "ADMIN"] } },
            orderBy: { name: "asc" },
            select: { id: true, std_id: true, name: true, email: true, department: true, cgpa: true, role: true },
        });
        return res.render("admin-dashboard", { user: req.user, students });
    } catch (err) {
        return next(err);
    }
});

app.get("/super-admin", async (req, res, next) => {
    if (!req.session.isSuperAdmin) {
        return res.status(200).render("super-admin-login", { error: "" });
    }

    try {
        const accounts = await prisma.user.findMany({
            where: { role: { in: ["STUDENT", "ADMIN"] } },
            orderBy: [{ role: "asc" }, { name: "asc" }],
            select: { id: true, std_id: true, name: true, email: true, department: true, cgpa: true, role: true },
        });
        return res.render("super-admin-dashboard", {
            admins: accounts.filter((account) => account.role === "ADMIN"),
            students: accounts.filter((account) => account.role === "STUDENT"),
            accounts,
        });
    } catch (err) {
        return next(err);
    }
});

app.post("/super-admin/login", (req, res, next) => {
    const { username, password } = req.body;
    if (username !== SUPER_ADMIN_USERNAME || password !== SUPER_ADMIN_PASSWORD) {
        return res.status(401).render("super-admin-login", { error: "Username or password is incorrect." });
    }

    req.session.regenerate((err) => {
        if (err) return next(err);
        req.session.isSuperAdmin = true;
        return req.session.save((saveError) => {
            if (saveError) return next(saveError);
            return res.redirect("/super-admin");
        });
    });
});

app.post("/super-admin/logout", (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie("connect.sid");
        return res.redirect("/super-admin");
    });
});

// connect some important middlewares
app.use(function(req,res,next){
    return res.status(404).json({
        success : false ,
        message : "Page not found"
    });
});

app.use(function(err,req,res,next){
    return res.status(500).json({
            success : false,
            message : "Find server error",
            error : err.message
        });
});



// ===== exports code ===== 

module.exports = myServer