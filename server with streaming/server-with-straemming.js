"use strict"

// main code 

let http = require("http");
let fs = require("fs");

let myServer = http.createServer(function(req,res){

    if(req.url === "/"){
        res.write(`<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Contact Form</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                max-width: 600px;
                                margin: 50px auto;
                                padding: 20px;
                            }
                            form {
                                border: 1px solid #ccc;
                                padding: 25px;
                                border-radius: 8px;
                                background-color: #f9f9f9;
                            }
                            label {
                                display: block;
                                margin-bottom: 8px;
                                font-weight: bold;
                            }
                            textarea {
                                width: 100%;
                                height: 150px;
                                padding: 10px;
                                margin-bottom: 15px;
                                border: 1px solid #ccc;
                                border-radius: 4px;
                                font-family: inherit;
                                font-size: 14px;
                                resize: vertical;
                            }
                            textarea:focus {
                                outline: none;
                                border-color: #4CAF50;
                                box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
                            }
                            button[type="submit"] {
                                background-color: #4CAF50;
                                color: white;
                                padding: 12px 24px;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 16px;
                            }
                            button[type="submit"]:hover {
                                background-color: #45a049;
                            }
                            button[type="submit"]:active {
                                background-color: #3d8b40;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>Submit Your Message</h2>
                        <form action="/submit" method="POST">
                            <label for="message">Message:</label>
                            <textarea id="message" name="message" placeholder="Enter your message here..." required></textarea>
                            
                            <button type="submit">Submit</button>
                        </form>
                    </body>
                    </html>
                    `);
        res.end ();
    }
    else if (req.url === "/submit"  && req.method === "POST"){
        // req.pipe(res);
        let myWriteStream = fs.createWriteStream("./output.txt");

        req.on("data",function(data){
            myWriteStream.write(data);
        });

        res.write("data stored successfully");
        res.end();

    }
    else{
        res.write("Path not found");
    }


});

myServer.listen(3000);
console.log("Server is running");
