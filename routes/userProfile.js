const express = require('express');
const router = express.Router();
const UserProfile = require("../model/profile");
const checkAuth = require('../middleware/checkAuth');

//update userDetail
router.put("/api/updateUserDetail",checkAuth, (req, res) => {
    const updateUser = new UserProfile({
        _id: req.query.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        address: req.body.address,
        mobile: req.body.mobile,
        password: req.body.password,
        email: req.body.email
    });
    
    UserProfile.updateOne({_id: req.query.id}, updateUser)
        .then(userData => {
            console.log("user: ",userData);
            if (userData) {
                res.status(200).json({
                    message: "User detail Updated",
                    result: userData,
                    response: true
                });
            }
            else{
                console.log("userdata :",userData);
            }
        })
        .catch(err => {
            // res.status(500).json({
            //     error: err
            // });

            console.log(err);
        });
})


//get userDetail
router.get("/api/userProfileDeatil", (req, res) => {
    UserProfile.findOne({ _id: req.query.id })
        .then(userData => {
            if (userData) {
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

//get userList
router.get("/api/userDeatil", (req, res) => {
    UserProfile.find()
        .then(userData => {
            if (userData) {
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
});

module.exports =router;
