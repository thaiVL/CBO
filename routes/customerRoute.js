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





var customerID = null;
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


router.put("/customerMore", (req, res) => {
    customerID = req.body.id
    
    res.sendFile(path.join(__dirname, "../views/customerMore.html"));
})


//////////////////
// CUSTOMERMORE //
//////////////////

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

router.get("/customerMore", (req, res) => {
    var query = `SELECT * FROM customer`
    con.query(query, (err, result) => {
        if(err){
            throw err
        }
        else{
            for(var i=0; i<result.length; i+=1){
                if(result[i].id == customerID){
                    res.send(result[i]);
                    return;
                }   
            }
        }
    });
    // console.log(customerID);
    // send all database info back to html for rendering
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