const express = require('express');
const bcrypt = require("bcrypt");
const user = require('../model/user');
const router = express.Router();

router.post('/api/singup',(req, res, next) =>{
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
})
module.exports = router;