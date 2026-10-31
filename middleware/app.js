"use strict";

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const writeLogger = require("./middlewares/builtin");

// Create Express application
const app = express();


// ============================================================
// Application Configuration
// ============================================================

app.disable("x-powered-by");


// ============================================================
// CORS Configuration
// ============================================================

const corsOptions = {
    credentials: true,
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


// ============================================================
// Built-in Middleware
// ============================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());


// ============================================================
// Application Logger
// ============================================================

app.use(writeLogger(true));


// ============================================================
// Health Check
// ============================================================

app.get("/health", (req, res) => {

    let allCookies = req.cookies ;

    res.set("author","ali");
    return res.status(200).json({
        success: true,
        message: "Server is healthy",
        cookies : allCookies,
        header : req.headers.accept

    });
});


// ============================================================
// Routes
// ============================================================

app.get("/about", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "About page",
    });
});


// ============================================================
// 404 - Route Not Found
// ============================================================

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
    });
});


// ============================================================
// Global Error Handler
// ============================================================

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);

    const statusCode = err.statusCode || err.status || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message
            
    });
});


// ============================================================
// Export
// ============================================================

module.exports = app;