"use strict"

const express = require("express");
const path = require("path");

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
        console.log("Inquiry database connected");
    }
});


var inquiryID = null;

async function addInquiry(data){
    return new Promise((resolve, reject) => {
        var query = `INSERT INTO inquiry (name, email, subject, data) 
        VALUES ('${data.name}', '${data.email}', '${data.subject}','${data.data}');`
        con.query(query, (err, result) => {
            if(err){
                // console.log(err);
                reject(err);
            }
            else{
                resolve("Successfully inserted new inquiry info into inquiry database!");
            }
        });
    });
}

async function deleteInquiry(id){
    return new Promise((resolve, reject) => {
        var query = `DELETE FROM inquiry WHERE id=${id}`
        con.query(query, (err, result) => {
            if(err){
                reject(err);
            }
            else{
                resolve("Successfully deleted inquiry");
            }
        })


    })
}

router.get("/loadInquiries", (req, res) => {
    var query = `SELECT * FROM inquiry`
    con.query(query, (err, result) => {
        if(err){
            throw err;
        }
        else{
            res.send(result);
        }
    });
})


router.delete("/deleteInquiry", (req, res) => {
    deleteInquiry(req.body.id)
    .then(() => {
        res.send("Success");
    })
    .catch(() =>{
        console.log("Error: failed to delete inquiry");

    })
})

router.post("/addInquiry", (req, res) => {
    addInquiry(req.body)
    .then(() => {
        res.status(204).send();
    })
    .catch(() => {
        console.log("Error: failed to add new customer into the customer database");
        res.status(204).send("Failed to add customer to database");
    })
})


router.put("/inquiryView", (req, res) => {
    inquiryID = req.body.id
    res.sendFile(path.join(__dirname, "../views/inquiryDetails.html"));
})

router.get("/inquiryDetails", (req, res) => {
    var query = `SELECT * FROM inquiry`
    con.query(query, (err, result) => {
        if(err){
            throw err
        }
        else{
            for(var i=0; i<result.length; i+=1){
                if(result[i].id == inquiryID){
                    res.send(result[i]);
                    return;
                }   
            }
        }
    });
});

module.exports = router;