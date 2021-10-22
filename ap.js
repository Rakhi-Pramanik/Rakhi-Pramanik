const express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var mongoDB = 'mongodb://127.0.0.1/test';
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const UserProfile = require("./model/profile");
const User = require("./model/user");
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
// xzx@i.in 1234567

app.post("/api/user/addProfile", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const addUser = new UserProfile({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: req.body.age,
                address: req.body.address,
                mobile: req.body.mobile,
                password: hash,
                email: req.body.email
            });

            addUser
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "User Created!",
                        result: result,
                        response: true
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
});

app.post("/api/login", function (req, res) {
    let fetchuser;
    let pwd ;
    UserProfile.findOne({ email: req.body.email })
        .then( async result => {
            if (!result) {
                 res.status(401).json({
                    message: "Auth failed"
                });
            }
            else{
                fetchuser = result;
                 pwd = await bcrypt.compare(req.body.password, result.password);
                if(pwd){
                    const token = jwt.sign(
                        { email: fetchuser.email, userId: fetchuser._id },
                        "secret_longer",
                        { expiresIn: "1h" }
                    );
                    res.status(200).json({
                        token: token,
                        expiresIn: 3600
                    });
                }else{
                    res.status(401).json({
                        message: "Auth failed"
                    });
                }
            }
        })
        .catch(err => {
             res.status(401).json({
                message: "Auth failed"
            });
        });
});


app.get("/api/userProfileDeatil" , (req, res) => {
    UserProfile.findOne({ _id: req.query.id })
    .then( userData =>{
        if(userData){
           res.status(200).json({
            message: "success",
            data: userData,
            response: true
           });
        }
    })
    .catch(err => {
        res.status(401).json({
           message: "Not Found"
       });
   });
})


// app.get("/api/lists", (req, res, next) => {
//     Post.find().then(documents => {
//       res.status(200).json({
//         message: "Posts fetched successfully!",
//         posts: documents
//       });
//     });
//   });

app.get("/api/userDeatil" , (req, res) => {
    UserProfile.find()
    .then( userData =>{
        if(userData){
           res.status(200).json({
            message: "success",
            data: userData,
            response: true
           });
        }
    })
    .catch(err => {
        res.status(401).json({
           message: "Not Found"
       });
   });
})


app.listen(3000, function () {
    console.log('app listening on port 3000!');
});

// const express = require('express');
// const bodyParser = require('body-parser');
// var mongoose = require('mongoose');
// const UserProfile = require("./model/profile");
// //const path = require("path");
// //const userprofileRoutes = require("./routes/userProfile");

// var mongoDB = 'mongodb://127.0.0.1/test';
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");
// const User = require('./model/user');
// var db = mongoose.connection;

// const app = express();
// app.post("/api/signup", function (req, res) {
//     // console.log(req.body);
//     bcrypt.hash(req.body.password, 10)
//         .then(hash => {
//             const user = new User({
//                 email: req.body.email,
//                 password: hash
//             });
//             console.log(user);
//             user
//                 .save()
//                 .then(result => {
//                     console.log("result ", result);
//                     res.status(201).json({
//                         message: "User created!",
//                         result: result
//                     });
//                 })
//                 .catch(err => {
//                     console.log("err :", err);
//                     res.status(500).json({
//                         error: err
//                     });
//                 });
//         });
// })


// app.get("/api/lists", (req, res, next) => {
//     Post.find().then(documents => {
//       res.status(200).json({
//         message: "Posts fetched successfully!",
//         posts: documents
//       });
//     });
//   });

