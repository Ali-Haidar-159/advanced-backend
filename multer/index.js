"use strict"

// import all the packages 
import app from "./app.js";

const PORT = 3000 ;

app.listen(PORT, function(){
    console.log(`Server is running @ http://localhost:${PORT}...`);
});