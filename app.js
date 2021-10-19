const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const test = require('assert');
const Post = require('./model/post');
const bodyParser = require('body-parser');
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'test';
const app = express();

    // MongoClient.connect(url)
    // .then(() => {
    //     console.log("connection closed with db");
    // })
    // .catch(() =>{
    //     console.log("connection closed with db");
    // });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-type, Accept");
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
    // const post = new Post({
    //     title: req.body.title,
    //     content: req.body.content
    // })
    // console.log(post);
    // dbName.col
    //post.save();
    res.status(201).json({
        message: 'Post added successfully!',
    });
});

app.listen(3000, function () {
    console.log('app listening on port 3000!');
});