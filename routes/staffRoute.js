"use strict"

const express = require("express");
const path = require("path");
const cryptojs = require("crypto-js");

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

function isNumeric(val) {
    return /^-?\d+$/.test(val);
}

async function addNewStaff(data){
    return new Promise((resolve, reject) => {
        // if(!(isNumeric(data.sin) && isNumeric(data.phonenum))){
        //     reject("Error: can only be numbers")
        // }

        var nameEC = cryptojs.AES.encrypt(data.name, `key`).toString();
        var jobtitleEC = cryptojs.AES.encrypt(data.jobTitle, `key`).toString();
        var dobEC = cryptojs.AES.encrypt(data.dob, `key`).toString();
        var phoneEC = cryptojs.AES.encrypt(data.phonenum, `key`).toString();
        var addrEC = cryptojs.AES.encrypt(data.addr, `key`).toString();
        var emailEC = cryptojs.AES.encrypt(data.email, `key`).toString();
        var sinEC = cryptojs.AES.encrypt(data.sin, `key`).toString();


        var query = `INSERT INTO staff (name, jobtitle, dob, phone, addr, email, sin)
        VALUES ('${nameEC}', '${jobtitleEC}', '${dobEC}','${phoneEC}','${addrEC}','${emailEC}','${sinEC}');`

        con.query(query, (err, result) => {
            if(err){
                reject(err);
            }
            else{
                resolve("Successfully inserted new staff info into staff database!");
            }
        });
    });
}

async function updateStaff(data){
    return new Promise((resolve, reject) => {
        var nameEC = cryptojs.AES.encrypt(data.name, `key`).toString();
        var jobtitleEC = cryptojs.AES.encrypt(data.job, `key`).toString();
        var dobEC = cryptojs.AES.encrypt(data.dob, `key`).toString();
        var phoneEC = cryptojs.AES.encrypt(data.phone, `key`).toString();
        var addrEC = cryptojs.AES.encrypt(data.addr, `key`).toString();
        var emailEC = cryptojs.AES.encrypt(data.email, `key`).toString();
        var sinEC = cryptojs.AES.encrypt(data.sin, `key`).toString();

        var query = `UPDATE staff SET name = '${nameEC}', jobtitle =  '${jobtitleEC}', dob = '${dobEC}', phone = '${phoneEC}', addr = '${addrEC}', email = '${emailEC}', sin = '${sinEC}' WHERE id = '${data.id}';`;
        con.query(query, (err, result) => {
            if(err){
                reject(err);
            }
            else{
                resolve("Successfully updated staff");
            }
        })
    })
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
            for(var i=0; i<result.length; i+=1){
                    result[i].name = (cryptojs.AES.decrypt(result[i].name, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].jobtitle = (cryptojs.AES.decrypt(result[i].jobtitle, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].dob = (cryptojs.AES.decrypt(result[i].dob, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].phone = (cryptojs.AES.decrypt(result[i].phone, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].addr = (cryptojs.AES.decrypt(result[i].addr, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].email = (cryptojs.AES.decrypt(result[i].email, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].sin = (cryptojs.AES.decrypt(result[i].sin, `key`)).toString(cryptojs.enc.Utf8);
            }
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
                    result[i].name = (cryptojs.AES.decrypt(result[i].name, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].jobtitle = (cryptojs.AES.decrypt(result[i].jobtitle, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].dob = (cryptojs.AES.decrypt(result[i].dob, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].phone = (cryptojs.AES.decrypt(result[i].phone, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].addr = (cryptojs.AES.decrypt(result[i].addr, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].email = (cryptojs.AES.decrypt(result[i].email, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].sin = (cryptojs.AES.decrypt(result[i].sin, `key`)).toString(cryptojs.enc.Utf8);
                    res.send(result[i]);
                    return;
                }   
            }
        }
    });
})

router.put("/updateInfo", (req, res) => {
    updateStaff(req.body)
        .then(() => {
            res.send("Successfully updated staff");
        })
        .catch(() => {
            console.log("Error: failed to update staff");
        })
})

module.exports = router;