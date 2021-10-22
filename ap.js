const express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var mongoDB = 'mongodb://127.0.0.1/test';
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const User = require('./model/user');
var db = mongoose.connection;

const app = express();

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    next();
});

app.post("/api/signup", function (req, res) {
    // console.log(req.body);
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
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
})

app.post("/api/login", function(req, res){
    let fetchuser;
    User.findOne({ email: req.body.email })
    .then( user =>{
        if(!user){
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        fetchuser = user;
        return bcrypt.compare(req.body.password , user.password);
    }).then( result =>{
        if(!result){
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        const token  = jwt.sign(
            {email: fetchuser.email, userId: fetchuser._id },
            "secret_longer",
            { expiresIn: "1h"}
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600
        });
    })
    .catch( err =>{
        return res.status(401).json({
            message:"Auth failed"
        });
    });
});

app.get("/api/lists", (req, res, next) => {
    Post.find().then(documents => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: documents
      });
    });
  });
app.listen(3000, function () {
    console.log('app listening on port 3000!');
});