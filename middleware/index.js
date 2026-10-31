let app = require("./app");

let PORT = 3000 ;

app.listen(PORT, function(){
    console.log(`Server is running @ http://localhost:${PORT}...`);
});