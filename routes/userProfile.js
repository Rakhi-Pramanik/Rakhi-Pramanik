const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserProfile = require("../model/profile");
const router = express.Router();

router.post("/addProfile", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then( hash => {
        const addUser = new UserProfile({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            address: req.body.address,
            mobile: req.body.mobile,
            password: req.body.password,
            email: req.body.email
        });

        addUser
        .save()
        .then( result =>{
            res.status(201).json({
                message: "User Created!",
                result: result
            });
        })
        .catch( err =>{
            res.status(500).json({
                error: err
            });
        });
    });
});

module.exports = router;