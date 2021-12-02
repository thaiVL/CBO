"use strict"

const express = require("express");
const path = require("path");
const cryptojs = require("crypto-js");

const router = express.Router();




var sql = require("mysql");
const { builtinModules } = require("module");

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
        console.log("Login database connected");
    }
});



router.put("/check", (req, res) => {
    if(req.body.email === "" || req.body.pass === ""){
        res.status(400).send("Missing required fields, please fill them out.")
        return;
    }
    var query = `SELECT * FROM login WHERE email = '${req.body.email}'`;
    con.query(query, (err, result) => {
        if(result.length === 0){
            // res.status(400);
            // res.send("Email doesn't exist");
            res.status(400).send("The email you entered doesn't exist. Please check again");
            return;
        }
        else{

            if(result[0].pass !== req.body.pass){
                res.status(400).send("Incorrect password. Please check again");
                return;
            }

            res.send("Success");

        }
    })
})






module.exports = router;