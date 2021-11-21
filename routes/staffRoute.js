"use strict"

const express = require("express");
const path = require("path");

const router = express.Router();




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
        console.log("Staff database connected");
    }
});


router.get("/endCon",(req, res)=>{
    con.end((err) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("Connected to database killed");
        }
    })
})

async function addNewStaff(data){
    return new Promise((resolve, reject) => {
        var query = `INSERT INTO staff (name, jobtitle, dob, phone, addr, email, sin) 
        VALUES ('${data.name}', '${data.jobTitle}', '${data.dob}','${data.phonenum}','${data.addr}','${data.email}','${data.sin}');`
        con.query(query, (err, result) => {
            if(err){
                // console.log(err);
                reject(err);
            }
            else{
                resolve("Successfully inserted new staff info into staff database!");
            }
        });
    });
}

async function deleteStaff(id){
    return new Promise((resolve, reject) => {
        var query = `DELETE FROM staff WHERE id=${id}`
        con.query(query, (err, result) => {
            if(err){
                reject(err);
            }
            else{
                resolve("Successfully deleted staff");
            }
        })


    })
}

router.post("/addnewstaff", (req, res) => {
    addNewStaff(req.body)
    .then(() => {
        res.status(204).send();
    })
    .catch(() => {
        console.log("Error: failed to add new staff into the staff database")
        res.status(204).send();
    })
});

router.get("/loadstaff", (req, res) => {
    var query = `SELECT * FROM staff`
    con.query(query, (err, result) => {
        if(err){
            throw (err);
        }
        else{
            res.send(result);
        }
    });
});

router.delete("/deleteStaff",(req, res) => {
    deleteStaff(req.body.id)
    .then(() => {
        res.send("Success");
    })
    .catch(() =>{
        console.log("Error: failed to delete staff");
    })
})

router.put("/moreInfo", (req, res) => {
    var query = `SELECT * FROM staff`
    con.query(query, (err, result) => {
        if(err){
            throw (err);
        }
        else{
            for(var i=0; i<result.length; i+=1){
                if(result[i].id == req.body.id){
                    res.send(result[i]);
                    return;
                }   
            }
        }
    });
})



module.exports = router;