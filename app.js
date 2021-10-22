const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const test = require('assert');
const Post = require('./model/post');
const bcrypt = require("bcrypt");
const user = require('./model/user');
const url = 'mongodb://localhost:27017/test';

const userRoutes = require('./routes/user');
const app = express();

// Database Name
const dbName = 'test';


mongoose
  .connect(
    url
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-type, Accept,Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    next();
});

app.get('/api/list', function (req, res) {
   post = new Post();
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection("infoList").find({},
        function(err, result) {
            if (err) throw err;
           post = res.json(result);
            db.close();
        });
    });
    res.status(200).json({
        message: 'Success data',
        posts: post
    });
});

app.get("/api/lists", function (req, res) {
    MongoClient.connect(url , function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        let _post;
        dbo.collection("infoList").find({}).toArray( function(err, result) {
            if (err) {
                return result.send("No data Found");
            }
            if(result){
                _post = result.json(result);    
            }
            return res.send(_post);
            // db.close();
        });
    });
    res.status(200).json({
        message: 'Success',
        posts: _post
    });
});

app.post("/api/posts", function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection("infoList").insertOne({
            title: req.body.title,
            content: req.body.content
        }, 
        function(err, result) {
            if (err) {
                return result.send("No data Found");
            }
            if(result){
                res.json(result);
            }
        });
    });
    res.status(201).json({
        message: 'Post added successfully!',
    });
});

app.post('/api/singup',(req, res, next) =>{
    MongoClient.connect(url , function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        bcrypt.hash(req.body.password, 10)
        .then( hash => {
            const user = new user({
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(result =>{
                res.status(201).json({
                    message: 'User created!',
                    result: result
                });
            }).catch( err => {
                res.status(500).json({
                    errror: err
                })
            })        
        })
    });
})

module.exports = app;