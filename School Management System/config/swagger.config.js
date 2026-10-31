// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

let options = {
    definition : {
        openapi : "3.0.0" ,
        info : {
            title : "School Management System",
            version : "1.0.0",
            description : ""
        }

    },
    servers : [
        {
            url : "http://localhost:3000"
        }
    ],
    apis : ['./swagger/*.swagger.js']
};

let swaggerDoc = swaggerJSDoc(options);


// ===== exports code ===== 

module.exports = swaggerDoc