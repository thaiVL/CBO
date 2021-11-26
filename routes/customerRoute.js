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

        // var query = `UPDATE customer SET name = '${nameEC}', occ =  '${occEC}', dob = '${dobEC}', phone = '${phoneEC}', addr = '${addrEC}', email = '${emailEC}', sin = '${sinEC}' WHERE id = '${data.id}';`;
        var query = `UPDATE customer SET name = '${data.name}', occ =  '${data.occ}', dob = '${data.dob}', phone = '${data.phone}', addr = '${data.addr}', email = '${data.email}', sin = '${data.sin}' WHERE id = '${data.id}';`;
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
        var query = `INSERT INTO customer (name, occ, dob, phone, addr, email, sin) 
        VALUES ('${data.name}', '${data.occ}', '${data.dob}','${data.phonenum}','${data.addr}','${data.email}','${data.sin}');`
        con.query(query, (err, result) => {
            if(err){
                // console.log(err);
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

async function saveReport(data, id){
    return new Promise((resolve, reject) => {
        var query = `UPDATE customer SET report = '${data}' WHERE id=${id};`;
        con.query(query, (err, result) => {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                resolve("Successfully save customer report to customer database");
            }
        })
    })
}

router.put("/customerMore", (req, res) => {
    var query = `SELECT * FROM customer`
    con.query(query, (err, result) => {
        if(err){
            throw err
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
});

router.put("/saveReport", (req, res) => {
    saveReport(req.body.data, req.body.id)
    .then(() => {
        res.send("Successfully saved report to customer base");
    })
    .catch(() => {
        console.log("Error: failed to save report to customer base");
    })
})







module.exports = router;