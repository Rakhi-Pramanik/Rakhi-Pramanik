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
                        expiresIn: 10000
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
    let time = new Date();
    UserProfile.findOne({ email: email })
    .then(mail => {
            var otp = generator.generate({
                length: 4,
                numbers: true
            });
            let otpValid = time.setMinutes(time.getMinutes() + 10);

            //update Column in Document
            UserProfile.findOneAndUpdate(
                { email: email },
                {
                    "$set": {
                        otp: otp, otpValid: otpValid
                    },
                }
            ).then((result, err) => {
                console.log("result in forget: ", result);
            }, err => {
                console.log("err in forget : ", err);
            });

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
    const d = new Date();
    let currenttime = d.getTime();
    email = '';
    console.log("time : ", currenttime, "userpword : ", userpword);
    UserProfile.findOne({ otp: userpword }).then(result => {
        
        email = result.email;
        otpExpiredTime = result.otpValid.getTime();
        console.log("otpExpiredTime : ", otpExpiredTime);
        console.log(result);

        if (otpExpiredTime > currenttime) {
            console.log("true");
            res.status(200).json({
                message: "Success",
                response: true,
                data: {
                    message: "OTP verification Successfull !",
                    email: email
                }
            });

            UserProfile.findOneAndUpdate(
                { email: email },
                {
                    "$set": {
                        otp: '', otpValid: ''
                    },
                }
            ).then((result, err) => {
                console.log("result : ", result);

                if(err){
                    console.log("err : ", err);
                }
            });
        }
        else {
            console.log("false");
            res.status(200).json({
                message: "Success",
                response: false,
                data: {
                    message: "OTP Expired !",
                    email: email
                }
            })
        }
    })
});

router.put("/api/passwordReset", (req, res) => {
    console.log(req.body.password,"email : ",req.body.email);

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        UserProfile.findOneAndUpdate(
            { email: req.body.email },
            {
                "$set": {
                    password: hash
                },
            }
        ).then((result, err) => {
            console.log("result in passwordReset: ", result);
            res.json({
                message: 'Password Reset Successfull',
                response: true
            })
        }, err => {
            console.log("err in passwordReset : ", err);
            res.json({
                message: 'Password Reset Unsuccessfull,Try again Later!',
                response: true
            })
        });

    })


})
module.exports = router;