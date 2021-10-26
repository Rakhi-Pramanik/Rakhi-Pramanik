const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const router = express.Router();
const UserProfile = require("../model/profile");

//signup
router.post("/api/user/addProfile", (req, res, next) => {
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

//login
router.post("/api/login", function (req, res) {
    let fetchuser;
    let pwd;
    UserProfile.findOne({ email: req.body.email })
        .then(async result => {
            if (!result) {
                res.status(401).json({
                    message: "Auth failed"
                });
            }
            else {
                fetchuser = result;
                pwd = await bcrypt.compare(req.body.password, result.password);
                if (pwd) {
                    const token = jwt.sign(
                        { email: fetchuser.email, userId: fetchuser._id },
                        "secret_longer",
                        { expiresIn: "1h" }
                    );
                    res.status(200).json({
                        token: token,
                        expiresIn: 3600
                    });
                } else {
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
module.exports = router;