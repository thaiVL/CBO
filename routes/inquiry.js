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
        console.log("Inquiry database connected");
    }
});

async function addInquiry(data){
    return new Promise((resolve, reject) => {
        if(data.name === "" || data.email === "" || data.subj === "" || data.inq === ""){
            reject("Required field(s) are empty! Failed to add inquiry to db");
            return;
        }

        var nameEC = cryptojs.AES.encrypt(data.name, `key`).toString();
        var emailEC = cryptojs.AES.encrypt(data.email, `key`).toString();
        var subjEC = cryptojs.AES.encrypt(data.subj, `key`).toString();
        var inqEC = cryptojs.AES.encrypt(data.inq, `key`).toString();

        var query = `INSERT INTO inquiry (name, email, subject, data) 
        VALUES ('${nameEC}', '${emailEC}', '${subjEC}','${inqEC}');`
        con.query(query, (err, result) => {
            if(err){
                console.log(err);
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

async function updateInquiry(data){
    return new Promise((resolve, reject) => {
        var nameEC = cryptojs.AES.encrypt(data.name, `key`).toString();
        var emailEC = cryptojs.AES.encrypt(data.email, `key`).toString();
        var subjEC = cryptojs.AES.encrypt(data.subj, `key`).toString();
        var inqEC = cryptojs.AES.encrypt(data.inq, `key`).toString();

        ////// FINISH THIS //////////////
        var query = `UPDATE inquiry SET name = '${nameEC}', subject = '${subjEC}', email = '${emailEC}', data = '${inqEC}' WHERE id = '${data.id}';`;
        con.query(query, (err, result) => {
            if(err){
                reject(err);
            }
            else{
                resolve("Successfully updated customer");
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
            for(var i=0; i<result.length; i+=1){
                result[i].name = (cryptojs.AES.decrypt(result[i].name, `key`)).toString(cryptojs.enc.Utf8);
                result[i].email = (cryptojs.AES.decrypt(result[i].email, `key`)).toString(cryptojs.enc.Utf8);
                result[i].subject = (cryptojs.AES.decrypt(result[i].subject, `key`)).toString(cryptojs.enc.Utf8);
                result[i].data = (cryptojs.AES.decrypt(result[i].data, `key`)).toString(cryptojs.enc.Utf8);
            }
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
    var query = `SELECT * FROM inquiry`
    con.query(query, (err, result) => {
        if(err){
            throw err
        }
        else{
            for(var i=0; i<result.length; i+=1){
                if(result[i].id == req.body.id){
                    result[i].name = (cryptojs.AES.decrypt(result[i].name, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].email = (cryptojs.AES.decrypt(result[i].email, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].subject = (cryptojs.AES.decrypt(result[i].subject, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].data = (cryptojs.AES.decrypt(result[i].data, `key`)).toString(cryptojs.enc.Utf8);
                    res.send(result[i]);
                    return;
                }
            }
        }
    });
})

router.put("/updateInfo", (req, res) => {
    updateInquiry(req.body)
        .then(() => {
            res.send("Successfully updated customer");
        })
        .catch(() => {
            console.log("Error: failed to update customer");
        })
})


module.exports = router;