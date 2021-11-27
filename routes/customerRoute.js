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
        console.log("Customer database connected");
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



async function updateCustomer(data){
    return new Promise((resolve, reject) => {
        var nameEC = cryptojs.AES.encrypt(data.name, `key`).toString();
        var occEC = cryptojs.AES.encrypt(data.occ, `key`).toString();
        var dobEC = cryptojs.AES.encrypt(data.dob, `key`).toString();
        var phoneEC = cryptojs.AES.encrypt(data.phone, `key`).toString();
        var addrEC = cryptojs.AES.encrypt(data.addr, `key`).toString();
        var emailEC = cryptojs.AES.encrypt(data.email, `key`).toString();
        var sinEC = cryptojs.AES.encrypt(data.sin, `key`).toString();
        var reportEC = cryptojs.AES.encrypt(data.report, `key`).toString();

        var query = `UPDATE customer SET name = '${nameEC}', occ =  '${occEC}', dob = '${dobEC}', phone = '${phoneEC}', addr = '${addrEC}', email = '${emailEC}', sin = '${sinEC}', report = '${reportEC}' WHERE id = '${data.id}';`;
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


async function addNewCustomer(data){
    return new Promise((resolve, reject) => {
        if(data.name === "" || data.occ === "" || data.dob === "" || data.phonenum === "" || data.addr === "" || data.email === "" || data.sin === ""){
            reject("Failed to insert new customer into db: empty fields detected");
            return;
        }
        var nameEC = cryptojs.AES.encrypt(data.name, `key`).toString();
        var occEC = cryptojs.AES.encrypt(data.occ, `key`).toString();
        var dobEC = cryptojs.AES.encrypt(data.dob, `key`).toString();
        var phoneEC = cryptojs.AES.encrypt(data.phonenum, `key`).toString();
        var addrEC = cryptojs.AES.encrypt(data.addr, `key`).toString();
        var emailEC = cryptojs.AES.encrypt(data.email, `key`).toString();
        var sinEC = cryptojs.AES.encrypt(data.sin, `key`).toString();


        var query = `INSERT INTO customer (name, occ, dob, phone, addr, email, sin)
        VALUES ('${nameEC}', '${occEC}', '${dobEC}','${phoneEC}','${addrEC}','${emailEC}','${sinEC}');`

        con.query(query, (err, result) => {
            if(err){
                reject(err);
            }
            else{
                resolve("Successfully inserted new customer info into customer database!");
            }
        });
    });
}


async function deleteCustomer(id){
    return new Promise((resolve, reject) => {
        var query = `DELETE FROM customer WHERE id=${id}`
        con.query(query, (err, result) => {
            if(err){
                reject(err);
            }
            else{
                resolve("Successfully deleted customer");
            }
        })


    })
}

router.put("/updateInfo", (req, res) => {
    updateCustomer(req.body)
        .then(() => {
            res.send("Successfully updated customer");
        })
        .catch(() => {
            console.log("Error: failed to update customer");
        })
})

router.get("/loadCustomer", (req, res) => {
    var query = `SELECT * FROM customer`
    con.query(query, (err, result) => {
        if(err){
            throw (err);
        }
        else{
            for(var i=0; i<result.length; i+=1){
                result[i].name = (cryptojs.AES.decrypt(result[i].name, `key`)).toString(cryptojs.enc.Utf8);
                result[i].occ = (cryptojs.AES.decrypt(result[i].occ, `key`)).toString(cryptojs.enc.Utf8);
                result[i].dob = (cryptojs.AES.decrypt(result[i].dob, `key`)).toString(cryptojs.enc.Utf8);
                result[i].phone = (cryptojs.AES.decrypt(result[i].phone, `key`)).toString(cryptojs.enc.Utf8);
                result[i].addr = (cryptojs.AES.decrypt(result[i].addr, `key`)).toString(cryptojs.enc.Utf8);
                result[i].email = (cryptojs.AES.decrypt(result[i].email, `key`)).toString(cryptojs.enc.Utf8);
                result[i].sin = (cryptojs.AES.decrypt(result[i].sin, `key`)).toString(cryptojs.enc.Utf8);
            }
            // console.log(result)
            res.send(result);
        }
    });
})


router.post("/addCustomer", (req, res) => {
    addNewCustomer(req.body)
    .then(() => {
        res.status(204).send();
    })
    .catch(() => {
        console.log("Error: failed to add new customer into the customer database");
        res.status(204).send("Failed to add customer to database");
    })
})

router.delete("/deleteCustomer", (req, res) => {
    deleteCustomer(req.body.id)
    .then(() => {
        res.send("Success");
    })
    .catch(() =>{
        console.log("Error: failed to delete customer");

    })
})

router.put("/customerMore", (req, res) => {
    var query = `SELECT * FROM customer`
    con.query(query, (err, result) => {
        if(err){
            throw err
        }
        else{
            for(var i=0; i<result.length; i+=1){
                if(result[i].id == req.body.id){
                    result[i].name = (cryptojs.AES.decrypt(result[i].name, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].occ = (cryptojs.AES.decrypt(result[i].occ, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].dob = (cryptojs.AES.decrypt(result[i].dob, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].phone = (cryptojs.AES.decrypt(result[i].phone, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].addr = (cryptojs.AES.decrypt(result[i].addr, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].email = (cryptojs.AES.decrypt(result[i].email, `key`)).toString(cryptojs.enc.Utf8);
                    result[i].sin = (cryptojs.AES.decrypt(result[i].sin, `key`)).toString(cryptojs.enc.Utf8);
                    if(result[i].report != null){
                        result[i].report = (cryptojs.AES.decrypt(result[i].report, `key`)).toString(cryptojs.enc.Utf8);
                    }
                    res.send(result[i]);
                    return;
                }   
            }
        }
    });
});






module.exports = router;