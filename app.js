const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const test = require('assert');
const Post = require('./model/post');
const User = require('./model/user');
const bodyParser = require('body-parser');
const url = 'mongodb://localhost:27017';
const bcrypt = require("bcrypt");
const router = express.Router();
// Database Name
const dbName = 'test';
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    next();
});

app.post("/api/signup", function(req, res){
   // console.log(req.body);
    bcrypt.hash(req.body.password , 10)
    .then(hash =>{
        const user = new User({
            email: req.body.email,
            password: hash
          });
          console.log(user);
          user
            .save()
            .then(result => {
                console.log("result ", result);
              res.status(201).json({
                message: "User created!",
                result: result
              });
            })
            .catch(err => {
                console.log("err :", err);
              res.status(500).json({
                error: err
              });
            });
        });
    // MongoClient.connect(url, function(err, db){
    //     if (err) throw err;
    //     var dbo = db.db(dbName);
    //     console.log("hash", hash);

    //         dbo.collection("client").insertOne({
    //             email: req.body.email,
    //             password: hash
    //         }, 
    //         function(err, result) {
    //             if (err) {
    //                 res.status(500).json({
    //                     message: 'server error'
    //                 })
    //             }
    //             if(result){
    //                 res.status(201).json({
    //                     message: 'User added successfully!',
    //                     data: result
    //                 });
    //             }
    //         });
    //     })
    // })
})

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
    //   res.send(posts);
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
                _post = result;
                console.log(result);
                res.status(200).json({
                    message: 'Success',
                    posts: _post
                });             
            }
        });
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
                res.status(201).json({
                    message: 'Post added successfully!',
                });
            }
        });
    });
});

app.listen(3000, function () {
    console.log('app listening on port 3000!');
});