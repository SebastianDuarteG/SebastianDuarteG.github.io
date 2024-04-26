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

app.use(express.json());

app.get('/products/featured', async function (req, res){
    try {
        let qry = 'SELECT productId, productName, imageUrl ' +
        'FROM Products WHERE productFeat = 1;';
        let db = await getDBConnection();
        let employee = await db.all(qry);
        await db.close();
        res.json(employee);
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post("/login", async (req, res) => {
    try{
        const { loginEmail, loginPassword } = req.body;
        let getUser = `SELECT * FROM Users WHERE userEmail = '${loginEmail}';`;
        const db = await getDBConnection();
        let check = await db.get(getUser);

        if (check === undefined) {
            await db.close();
            res.status(400).send("Invalid user");
        } else {
            if (loginPassword === check.userPassword) {
                let cartCreation= `INSERT INTO Carts  (cartStatus, cartDate, userId)
                VALUES (0, 0, ?);`
                await db.run(cartCreation, [check.userId])
                if (check.userType === "1") {
                    await db.close();
                    res.status(201).send(check.userId.toString());
                } else {
                    await db.close();
                    res.status(200).send(check.userId.toString());
                }
            } else {
                await db.close();
                res.status(400).send("Invalid password");
            }
        }
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});


app.post('/register', async (req,res) => {
    try{
        const { registerUserName, registerEmail, registerPassword } = req.body;
        const query = 'INSERT INTO Users (dateCreated, timeCreated, userName, '+
            `userEmail, userPassword, userType) VALUES ( 0, 0, ?, ?, ?, ?);`;
        const db= await getDBConnection();
        await db.run(query, [registerUserName, registerEmail, registerPassword, "0"]);
        await db.close();
        res.status(200).send("User registered successfully");
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
    
});

app.get('/search', async function (req, res){
    try {
        const reqHeaders = {
            search: req.headers.search,
        };
        if (!reqHeaders.search){
            return res.status(400).send("Invalid Request");
        }
        const query = 'SELECT * ' +
        `FROM Products WHERE productName like ?;`;
        const db= await getDBConnection();
        let products =  await db.all(query, [`%${reqHeaders.search}%`]);
        await db.close();
        res.json(products);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/categories', async function (req, res){
    try {
        const query = 'SELECT catName, catId FROM Categories WHERE 1 ORDER BY catOrder ASC;';
        const db= await getDBConnection();
        let categories =  await db.all(query);
        await db.close();
        res.json(categories);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/category/search', async function (req, res){
    try {
        const reqHeaders = {
            catId: req.headers.catid,
        };
        if (!reqHeaders.catId){
            return res.status(400).send("Invalid Request");
        }
        const query = 'SELECT catName ' +
        `FROM Categories WHERE catId = ?;`;
        const db= await getDBConnection();
        let category =  await db.get(query, [reqHeaders.catId]);
        await db.close();
        res.json(category);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/category/products',  async function (req, res){
    try {
        const reqHeaders = {
            catId: req.headers.catid,
        };
        if (!reqHeaders.catId){
            return res.status(400).send("Invalid Request");
        }
        const query = 'SELECT * ' +
        `FROM Products WHERE catId = ?;`;
        const db= await getDBConnection();
        let products =  await db.all(query, [reqHeaders.catId]);
        await db.close();
        res.json(products);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/allProducts', async function (req, res){
    try {
        const query = 'SELECT * FROM Products WHERE 1 ORDER BY productId ASC;';
        const db= await getDBConnection();
        let products =  await db.all(query);
        await db.close();
        res.json(products);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.get('/product/search', async function (req, res){
    try {
        const reqHeaders = {
            productId: req.headers.productid,
        };
        if (!reqHeaders.productId){
            return res.status(400).send("Invalid Request");
        }
        const query = 'SELECT * ' +
        `FROM Products WHERE productId = ?;`;
        const db= await getDBConnection();
        let product =  await db.get(query, [reqHeaders.productId]);
        await db.close();
        res.json(product);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
});

app.post('/addToCart', async (req,res) => {
    try{
        const { userId, productId } = req.body;
        const query = `INSERT INTO CartProducts (cartId, productId, quantity) VALUES (?, ?, 1)`;
        const db= await getDBConnection();
        let cart = await db.get(`SELECT cartId FROM Carts WHERE userId = ?`, [userId]);
        await db.run(query, [cart.cartId, productId]);
        await db.close();
        res.status(200);
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
    
});

app.get('/cart/products', async (req,res) => {
    try {
        const reqHeaders = {
            userId: req.headers.userid,
        };
        if (!reqHeaders.userId){
            return res.status(400).send("Invalid Request");
        }
        const query = `SELECT Products.productName, Products.productPrice,
        CartProducts.quantity, Products.imageUrl, Products.productId
        FROM Products, CartProducts, Carts 
        WHERE Products.productId = CartProducts.productId
        AND CartProducts.cartId= Carts.cartId
        AND Carts.userId = ?;`;
        const db= await getDBConnection();
        let product =  await db.all(query, [reqHeaders.userId]);
        await db.close();
        res.json(product);
    } catch (err){
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
})

app.post('/quantity/change', async (req,res) => {
    try{
        const { productId, setNumber } = req.body;
        if (!productId || !setNumber){
            return res.status(400).send ("Invalid request.");
        }
        const query = `UPDATE CartProducts 
        SET quantity = ?
        WHERE productId = ?;`;
        const db= await getDBConnection();
        await db.run(query, [setNumber, productId]);
        await db.close();
        res.status(200).send("User registered successfully");
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
    
});

app.post('/deleteProduct', async (req,res) => {
    try{
        const { productId } = req.body;
        if (!productId){
            return res.status(400).send ("Invalid request.");
        }
        const query = `DELETE FROM CartProducts 
        WHERE productId = ?;`;
        const db= await getDBConnection();
        await db.run(query, [productId]);
        await db.close();
        res.status(200).send("User registered successfully");
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
    
});

app.post('/checkout', async (req,res) => {
    try{
        const { userId } = req.body;
        if (!userId){
            return res.status(400).send ("Invalid request.");
        }
        const query = `DELETE FROM CartProducts 
        WHERE cartId IN (
            SELECT cartId
            FROM Carts
            WHERE userId = ?
        );`;
        const db= await getDBConnection();
        await db.run(query, [userId]);
        await db.close();
        res.status(200).send("User registered successfully");
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
    
});

app.post('/addProduct', async (req,res) => {
    try{
        const { name, description, catId, imageUrl, price, dimensions, materials } = req.body;
        const query = `INSERT INTO Products (productName, imageUrl,
        productPrice, productDesc, productDimen, productMater, catId, productFeat)
        VALUES (?,?,?,?,?,?,?, 0);`;
        const db= await getDBConnection();
        await db.run(query, [name, imageUrl, price, description, dimensions, materials,
            catId]);
        await db.close();
        res.status(200).send("User registered successfully");
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
    
});

app.post('/editProduct', async (req,res) => {
    try{
        const { name, description, catId, imageUrl, price, dimensions, materials, productId } = req.body;
        const query= `UPDATE Products 
                       SET productName = ?, 
                           productDesc = ?, 
                           catId = ?, 
                           imageUrl = ?, 
                           productPrice = ?, 
                           productDimen = ?, 
                           productMater = ?
                       WHERE productId = ?;`;
        const params = [name, description, catId, imageUrl, price, dimensions, materials, productId];
        const db= await getDBConnection();
        await db.run(query, params);
        await db.close();
        res.status(200).send("User registered successfully");
    } catch (err) {
        res.type('text');
        res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
    
});

app.get('/quote', async (req, res) => {
    try {
        const response = await fetch('https://zenquotes.io/api/today');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);