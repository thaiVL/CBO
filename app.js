"use strict"

const bodyparser = require("body-parser");
const express = require("express");
const path = require("path");
const fs = require('fs');

const key = fs.readFileSync("./selfsigned.key");
const cert = fs.readFileSync("./selfsigned.crt");
const app = express();

const https = require("https");
const http = require("http");

const httpsServer = https.createServer({key: key, cert: cert}, app);
const httpServer = http.createServer(app);


app.use(bodyparser.urlencoded({extended: true}));

const PORT = 3000;
const HOST = "0.0.0.0";

const staffRoute = require("./routes/staffRoute");
const customerRoute = require("./routes/customerRoute");
const inquiryRoute = require("./routes/inquiry");

// DELETE DB CONNECTION AFTER FINISH ROUTING
var sql = require("mysql");

var con = sql.createConnection({
    host: "mysql",
    user: "root",
    database: "CBOdb",
    password: "admin"
})

con.connect((err) =>{
    if(err){
        console.log(err);
    }
    else{
        console.log("App database connected");
    }
});


app.get("/endCon",(req, res)=>{
    con.end((err) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("Connected to database killed");
        }
    })
})



//////////
// HOME //
//////////




///////////
// STAFF //
///////////


app.use("/staff",staffRoute);


//////////////
// CUSTOMER //
//////////////

app.use("/customer", customerRoute);

///////////////
// INQUIRIES //
///////////////


app.use("/inquiry", inquiryRoute);










app.use("/", express.static(path.join(__dirname, "./views")));
// httpServer.listen(PORT, () => {console.log("http listening on port 3000")});
httpsServer.listen(3001, () => {console.log("https secure listening on port 3001")});

app.listen(PORT, HOST);
// console.log("Server alive\n");

