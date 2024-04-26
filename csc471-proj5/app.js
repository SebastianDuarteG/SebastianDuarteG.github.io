//app.js
// API for access to database
'use strict';
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const multer = require('multer');
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const INVALID_PARAM_ERROR = 400;
const SERVER_ERROR = 500;
const SERVER_ERROR_MSG = 'Something went wrong on the server.';
/**
* Establishes a database connection to a database and returns the database object.
* Any errors that occur during connection should be caught in the function
* that calls this one.
* @returns {Object} - The database object for the connection.
*/
async function getDBConnection() {
const db = await sqlite.open({
filename: 'database.db',
driver: sqlite3.Database
});
return db;
}

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*'); 
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.get('/employee', async function (req, res){
    try {
        let qry = 'SELECT ssn, DOB, fName, mInit, lName, address ' +
        'FROM employee ORDER BY ssn DESC;';
        let db = await getDBConnection();
        let employee = await db.all(qry);
        await db.close();
        res.json(employee);
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/employee/search', async function (req, res){
    try {
        const reqHeaders = {
            ssn: req.headers.ssn,
        };
        if (!reqHeaders.ssn){
            return res.status(400).send("Invalid Request");
        }
        const query = 'SELECT ssn, DOB, fName, mInit, lName, address ' +
        `FROM employee WHERE ssn = ? ;`;
        const db= await getDBConnection();
        let employee =  await db.get(query, [reqHeaders.ssn]);
        await db.close();
        res.json(employee);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/employee/add', async (req, res) => {
    try {
        const reqBody = {
            ssn: req.body.ssn,
            DOB: req.body.DOB,
            fName: req.body.fName,
            mInit: req.body.mInit,
            lName: req.body.lName,
            address: req.body.address,
        };
        if (!reqBody.ssn || !reqBody.DOB || !reqBody.fName || !reqBody.lName ||
            !reqBody.address){
            return res.status(400).send ("Invalid request.");
        } else if (!reqBody.mInit){
            reqBody.mInit = "N/A";
        }
        const query = 'INSERT INTO employee (ssn, DOB, fName, mInit, lName, address) '+
        `VALUES (?,?,?,?,?,?);`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.ssn, reqBody.DOB, reqBody.fName, reqBody.mInit,
            reqBody.lName, reqBody.address]);
        await db.close();
    } catch(err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/employee/delete', async (req,res) => {
    try{
        const reqBody = {
            ssn: req.body.ssn,
        };
        if (!reqBody.ssn){
            return res.status(400).send("Invalid Request");
        }
        const query= `DELETE FROM employee WHERE ssn = ?;`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.ssn]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post ('/employee/edit', async(req, res)=>{
    try{
        const reqBody = {
            ssn: req.body.ssn,
            DOB: req.body.DOB,
            fName: req.body.fName,
            mInit: req.body.mInit,
            lName: req.body.lName,
            address: req.body.address,
        };
        if (!reqBody.ssn || !reqBody.DOB || !reqBody.fName || !reqBody.lName ||
            !reqBody.address){
            return res.status(400).send ("Invalid request.");
        } else if (!reqBody.mInit){
            reqBody.mInit = "N/A";
        }
        const query = `UPDATE employee SET DOB = ?, fName= ?, mInit= ?, lName= ?,
            address= ? WHERE ssn = ?`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.DOB, reqBody.fName, reqBody.mInit, reqBody.lName,
            reqBody.address, reqBody.ssn]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/salariedEmp', async function (req, res){
    try {
        let qry = 'SELECT ssn, salary ' +
        'FROM salariedEmp ORDER BY ssn DESC;';
        let db = await getDBConnection();
        let salariedEmp = await db.all(qry);
        await db.close();
        res.json(salariedEmp);
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/salariedEmp/search', async function (req, res){
    try {
        const reqHeaders = {
            ssn: req.headers.ssn,
        };
        if (!reqHeaders.ssn){
            return res.status(400).send("Invalid Request");
        }
        const query = 'SELECT ssn, salary ' +
        `FROM salariedEmp WHERE ssn = ? ;`;
        const db= await getDBConnection();
        let salariedEmp =  await db.get(query, [reqHeaders.ssn]);
        await db.close();
        res.json(salariedEmp);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/salariedEmp/add', async (req, res) => {
    try {
        const reqBody = {
            ssn: req.body.ssn,
            salary: req.body.salary,
        };
        if (!reqBody.ssn || !reqBody.salary){
            return res.status(400).send ("Invalid request.");
        }
        const query = 'INSERT INTO salariedEmp (ssn, salary) '+
        `VALUES (?,?);`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.ssn, reqBody.salary]);
        await db.close();
    } catch(err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/salariedEmp/delete', async (req,res) => {
    try{
        const reqBody = {
            ssn: req.body.ssn,
        };
        if (!reqBody.ssn){
            return res.status(400).send("Invalid Request");
        }
        const query= `DELETE FROM salariedEmp WHERE ssn = ?;`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.ssn]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post ('/salariedEmp/edit', async(req, res)=>{
    try{
        const reqBody = {
            ssn: req.body.ssn,
            salary: req.body.salary,
        };
        if (!reqBody.ssn || !reqBody.salary){
            return res.status(400).send ("Invalid request.");
        }
        const query = `UPDATE salariedEmp SET salary= ? WHERE ssn = ?`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.salary, reqBody.ssn]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/hourlyEmp', async function (req, res){
    try {
        let qry = 'SELECT ssn, hourPay ' +
        'FROM hourlyEmp ORDER BY ssn DESC;';
        let db = await getDBConnection();
        let hourlyEmp = await db.all(qry);
        await db.close();
        res.json(hourlyEmp);
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/hourlyEmp/search', async function (req, res){
    try {
        const reqHeaders = {
            ssn: req.headers.ssn,
        }
        if (!reqHeaders.ssn){
            return res.status(400).send("Invalid Request");
        }
        const query = 'SELECT ssn, hourPay ' +
        `FROM hourlyEmp WHERE ssn = ? ;`;
        const db= await getDBConnection();
        let hourlyEmp =  await db.get(query, [reqHeaders.ssn]);
        await db.close();
        res.json(hourlyEmp);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/hourlyEmp/add', async (req, res) => {
    try {
        const reqBody = {
            ssn: req.body.ssn,
            hourPay: req.body.hourPay,
        };
        if (!reqBody.ssn || !reqBody.hourPay){
            return res.status(400).send ("Invalid request.");
        }
        const query = 'INSERT INTO hourlyEmp (ssn, hourPay) '+
        `VALUES (?,?);`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.ssn, reqBody.hourPay]);
        await db.close();
    } catch(err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/hourlyEmp/delete', async (req,res) => {
    try{
        const reqBody = {
            ssn : req.body.ssn,
        };
        if (!reqBody.ssn){
            return res.status(400).send("Invalid Request");
        }
        const query= `DELETE FROM hourlyEmp WHERE ssn = ?;`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.ssn]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post ('/hourlyEmp/edit', async(req, res)=>{
    try{
        const reqBody = {
            ssn: req.body.ssn,
            hourPay: req.body.hourPay,
        };
        if (!reqBody.ssn || !reqBody.hourPay){
            return res.status(400).send ("Invalid request.");
        }
        const query = `UPDATE hourlyEmp SET hourPay= ? WHERE ssn = ?`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.hourPay, reqBody.ssn]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/department', async function (req, res){
    try {
        let qry = 'SELECT deptNum, deptName, numEmp ' +
        'FROM department ORDER BY deptNum DESC;';
        let db = await getDBConnection();
        let department = await db.all(qry);
        await db.close();
        res.json(department);
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/department/search', async function (req, res){
    try {
        const deptNum = req.headers.deptnum;
        if (!deptNum){
            return res.status(400).send("Invalid Request");
        }
        const query = `SELECT deptNum, deptName, numEmp 
        FROM department WHERE deptNum = ? ;`
        const db = await getDBConnection();
        let department = await db.get(query, [deptNum]);
        await db.close();
        if (!department) { 
            return res.status(404).send("Department not found");
        }
        res.json(department);
    } catch (err){
        console.error(err); 
        res.status(500).send("Internal Server Error"); 
    }
});

app.post('/department/add', async (req, res) => {
    try {
        const reqBody = {
            deptNum: req.body.deptNum,
            deptName: req.body.deptName,
            numEmp: req.body.numEmp,
        };
        if (!reqBody.deptNum || !reqBody.deptName || !reqBody.numEmp){
            return res.status(400).send ("Invalid request.");
        }
        const query = 'INSERT INTO department (deptNum, deptName, numEmp) '+
        `VALUES (?,?,?);`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.deptNum, reqBody.deptName, reqBody.numEmp]);
        await db.close();
    } catch(err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/department/delete', async (req,res) => {
    try{
        const reqBody = {
            deptNum : req.body.deptNum,
        };
        if (!reqBody.deptNum){
            return res.status(400).send("Invalid Request");
        }
        const query= `DELETE FROM department WHERE deptNum = ?;`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.deptNum]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post ('/department/edit', async(req, res)=>{
    try{
        const reqBody = {
            deptNum: req.body.deptNum,
            deptName: req.body.deptName,
            numEmp: req.body.numEmp,
        };
        if (!reqBody.deptNum || !reqBody.deptName || !reqBody.numEmp){
            return res.status(400).send ("Invalid request.");
        }
        const query = `UPDATE department SET deptName= ?, numEmp= ? WHERE deptNum = ?`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.deptName, reqBody.numEmp, reqBody.deptNum]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/location', async function (req, res){
    try {
        let qry = 'SELECT deptNum, locAddress ' +
        'FROM location ORDER BY deptNum DESC;';
        let db = await getDBConnection();
        let location = await db.all(qry);
        await db.close();
        res.json(location);
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/location/search', async function (req, res){
    try {
        const deptNum = req.headers.deptnum;
        if (!deptNum){
            return res.status(400).send("Invalid Request");
        }
        const query = `SELECT deptNum, locAddress 
        FROM location WHERE deptNum = ?;`;
        const db= await getDBConnection();
        let location =  await db.get(query, [deptNum]);
        await db.close();
        res.json(location);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/location/add', async (req, res) => {
    try {
        const reqBody = {
            deptNum: req.body.deptNum,
            locAddress: req.body.locAddress,
        };
        if (!reqBody.deptNum || !reqBody.locAddress){
            return res.status(400).send ("Invalid request.");
        }
        const query = 'INSERT INTO location (deptNum, locAddress) '+
        `VALUES (?,?);`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.deptNum, reqBody.locAddress]);
        await db.close();
    } catch(err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/location/delete', async (req,res) => {
    try{
        const reqBody = {
            deptNum : req.body.deptNum,
        };
        if (!reqBody.deptNum){
            return res.status(400).send("Invalid Request");
        }
        const query= `DELETE FROM location WHERE deptNum = ?;`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.deptNum]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post ('/location/edit', async(req, res)=>{
    try{
        const reqBody = {
            deptNum: req.body.deptNum,
            locAddress: req.body.locAddress,
        };
        if (!reqBody.deptNum || !reqBody.locAddress){
            return res.status(400).send ("Invalid request.");
        }
        const query = `UPDATE location SET locAddress= ? WHERE deptNum = ?`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.locAddress, reqBody.deptNum]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/project', async function (req, res){
    try {
        let qry = 'SELECT projNum, projName, projDesc ' +
        'FROM project ORDER BY projNum DESC;';
        let db = await getDBConnection();
        let project = await db.all(qry);
        await db.close();
        res.json(project);
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/project/search', async function (req, res){
    try {
        const projNum = req.headers.projnum;
        if (!projNum){
            return res.status(400).send("Invalid Request");
        }
        const query = `SELECT projNum, projName, projDesc 
        FROM project WHERE projNum = ?;`;
        const db= await getDBConnection();
        let project =  await db.get(query, [projNum]);
        await db.close();
        res.json(project);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/project/add', async (req, res) => {
    try {
        const reqBody = {
            projNum: req.body.projNum,
            projName: req.body.projName,
            projDesc: req.body.projDesc,
        };
        if (!reqBody.projNum || !reqBody.projName){
            return res.status(400).send ("Invalid request.");
        } else if (!reqBody.projDesc){
            reqBody.projDesc='N/A';
        }
        const query = 'INSERT INTO project (projNum, projName, projDesc) '+
        `VALUES (?,?,?);`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.projNum, reqBody.projName, reqBody.projDesc]);
        await db.close();
    } catch(err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/project/delete', async (req,res) => {
    try{
        const reqBody = {
            projNum : req.body.projNum,
        };
        if (!reqBody.projNum){
            return res.status(400).send("Invalid Request");
        }
        const query= `DELETE FROM project WHERE projNum = ?;`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.projNum]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post ('/project/edit', async(req, res)=>{
    try{
        const reqBody = {
            projNum: req.body.projNum,
            projName: req.body.projName,
            projDesc: req.body.projDesc,
        };
        if (!reqBody.projNum || !reqBody.projName){
            return res.status(400).send ("Invalid request.");
        } else if (!reqBody.projDesc){
            reqBody.projDesc='N/A';
        }
        const query = `UPDATE project SET projName= ?, projDesc= ? WHERE projNum = ?`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.projName, reqBody.projDesc, reqBody.projNum]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/worksOn', async function (req, res){
    try {
        let qry = 'SELECT ssn, deptNum, projNum ' +
        'FROM worksOn ORDER BY ssn DESC;';
        let db = await getDBConnection();
        let worksOn = await db.all(qry);
        await db.close();
        res.json(worksOn);
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/worksOn/search', async function (req, res){
    try {
        const ssn = req.headers.ssn;
        if (!ssn){
            return res.status(400).send("Invalid Request");
        }
        const query = `SELECT ssn, deptNum, projNum 
        FROM worksOn WHERE ssn = ?;`;
        const db= await getDBConnection();
        let worksOn =  await db.get(query, [ssn]);
        await db.close();
        res.json(worksOn);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/worksOn/add', async (req, res) => {
    try {
        const reqBody = {
            ssn: req.body.ssn,
            deptNum: req.body.deptNum,
            projNum: req.body.projNum,
        };
        if (!reqBody.ssn || !reqBody.deptNum || !reqBody.projNum){
            return res.status(400).send ("Invalid request.");
        }
        const query = 'INSERT INTO worksOn (ssn, deptNum, projNum) '+
        `VALUES (?,?,?);`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.ssn, reqBody.deptNum, reqBody.projNum]);
        await db.close();
    } catch(err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/worksOn/delete', async (req,res) => {
    try{
        const reqBody = {
            ssn : req.body.ssn,
        };
        if (!reqBody.ssn){
            return res.status(400).send("Invalid Request");
        }
        const query= `DELETE FROM worksOn WHERE ssn = ?;`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.ssn]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post ('/worksOn/edit', async(req, res)=>{
    try{
        const reqBody = {
            ssn: req.body.ssn,
            deptNum: req.body.deptNum,
            projNum: req.body.projNum,
        };
        if (!reqBody.ssn || !reqBody.deptNum || !reqBody.projNum){
            return res.status(400).send ("Invalid request.");
        } 
        const query = `UPDATE worksOn SET deptNum= ?, projNum= ? WHERE ssn = ?`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.deptNum, reqBody.projNum, reqBody.ssn]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/dependent', async function (req, res){
    try {
        let qry = 'SELECT ssn, name, relation ' +
        'FROM dependent ORDER BY ssn DESC;';
        let db = await getDBConnection();
        let dependent = await db.all(qry);
        await db.close();
        res.json(dependent);
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/dependent/search', async function (req, res){
    try {
        const ssn = req.headers.ssn;
        const name = req.headers.name;
        if (!ssn || !name){
            return res.status(400).send("Invalid Request");
        }
        const query = `SELECT ssn, name, relation 
        FROM dependent WHERE ssn = ?
        AND name= ?;`;
        const db= await getDBConnection();
        let dependent =  await db.get(query, [ssn, name]);
        await db.close();
        res.json(dependent);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/dependent/add', async (req, res) => {
    try {
        const reqBody = {
            ssn: req.body.ssn,
            name: req.body.name,
            relation: req.body.relation,
        };
        if (!reqBody.ssn || !reqBody.name || !reqBody.relation){
            return res.status(400).send ("Invalid request.");
        }
        const query = 'INSERT INTO dependent (ssn, name, relation) '+
        `VALUES (?,?,?);`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.ssn, reqBody.name, reqBody.relation]);
        await db.close();
    } catch(err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/dependent/delete', async (req,res) => {
    try{
        const reqBody = {
            ssn : req.body.ssn,
            name : req.body.name,
        };
        if (!reqBody.ssn || !reqBody.name){
            return res.status(400).send("Invalid Request");
        }
        const query= `DELETE FROM dependent WHERE ssn = ?
        AND name= ?;`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.ssn, reqBody.name]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post ('/dependent/edit', async(req, res)=>{
    try{
        const reqBody = {
            ssn: req.body.ssn,
            name: req.body.name,
            relation: req.body.relation,
        };
        if (!reqBody.ssn || !reqBody.name || !reqBody.relation){
            return res.status(400).send ("Invalid request.");
        } 
        const query = `UPDATE dependent SET relation= ? WHERE ssn = ?, name= ?`;
        const db= await getDBConnection();
        await db.run(query, [reqBody.relation, reqBody.ssn, reqBody.name]);
        await db.close();
    } catch (err){
        res.status(SERVER_ERROR).send(SERVER_ERROR-_MSG);
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);