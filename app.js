"use strict"

const bodyparser = require("body-parser");
const express = require("express");
const path = require("path");
const fs = require('fs');

const app = express();
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


app.listen(PORT, HOST);
console.log("Server alive\n");

