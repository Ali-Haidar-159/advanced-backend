"use strict"

// import all the packages 
import app from "./app.js";

import dotenv from "dotenv";
import chalk from "chalk"
import connectDB from "./config/database.config.js";

dotenv.config();

const port = process.env.PORT || 5000 ;
const dbConnectionString = process.env.DB_LINK ;
const consoleDesign = chalk.bgRed.bold.italic ;

app.listen(port, async function(){
    console.log(consoleDesign(`Server is running at http://localhost:${port}...`));

    await connectDB(dbConnectionString);
});

