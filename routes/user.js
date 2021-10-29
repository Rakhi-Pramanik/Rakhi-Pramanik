const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const { Auth } = require("two-step-auth");
var generator = require('generate-password');
const router = express.Router();
const UserProfile = require("../model/profile");
var pword;
var email;
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
                    message: "Authentication failed"
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
                        message: "Password Incorrect !",
                        description: 'please enter valid password'
                    });
                }
            }
        })
        .catch(err => {
            res.status(401).json({
                message: "Authentication failed"
            });
        });
});

//forget Password
router.get("/api/forgetPassword", (req, res, next) => {
    email = req.query.id;
    console.log(req.query.id);
    UserProfile.findOne({ email: email })
        .then(mail => {
            console.log("mail", mail);
            var otp = generator.generate({
                length: 4,
                numbers: true
            });
            console.log("pword ", otp);
            var transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                service: "gmail",
                port: 25,
                secure: false,

                auth: {
                    user: 'pramanikrakhi6@gmail.com', //email ID
                    pass: '13@dg!r1'  //Password 
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            sendMail(email, otp);

            function sendMail(email, otp) {
                pword = otp;
                var details = {
                    from: 'pramanikrakhi6@gmail.com', // sender address same as above
                    to: email, 					// Receiver's email id
                    subject: 'Your demo OTP is ', // Subject of the mail.
                    html: otp					// Sending OTP 
                };
                transporter.sendMail(details, function (error, data) {
                    if (error) {
                        console.log("err", error)
                        res.status(401).json({
                            message: "mail id does not exist."
                        });
                    }
                    else if (data.accepted) {
                        console.log("else :", email);
                        res.status(200).json({
                            message: "success",
                            data: {
                                message: 'otp send successfully to the registered mail',
                                data: otp
                            },
                            response: true
                        });
                    }
                });
            }
        })
        .catch(err => {
            res.status(401).json({
                message: "Auth failed"
            });
        });
})

router.get("/api/verification", (req, res, next) => {
    res.status(200).json({
        message: 'success',
        response: true,
        data: {
            otp: pword
        }
    })
})

router.post("/api/otpConfirm", (req, res, next) => {
    let userpword = req.body.otp;
    if (pword == userpword) {
        console.log("email", email);
        res.status(200).json({
            message: "Success",
            response: true,
            data: {
                message: "OTP verification Successfull !"
            }
        })
    }
});

router.put("/api/passwordReset", (req, res) => {
    const updatePassword = new UserProfile({
        password: req.body.newPassword
    });
    UserProfile.findOne({})
    UserProfile.updateOne({ email: email }, updatePassword)
        .then(userData => {
            if (userData) {
                res.status(200).json({
                    message: "Password Update Success!",
                    response: true,
                })
            }
        })

})
module.exports = router;