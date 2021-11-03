const express = require('express');
const router = express.Router();
const HomeSetting = require('../model/homeSetting');

router.post("/api/bannerUpdate",upload.single('file'),(req, res, next) => {
    // let imagePath = req.body.imagePath;
     const url = req.protocol + "://" + req.get("host");
     console.log("req.body ",req.body);
     // if (req.file) {
     //   const url = req.protocol + "://" + req.get("host");
     //   imagePath = url + "/images/" + req.file.filename;
     // }
     const post = new Post({
       title: req.body.title,
       content: req.body.content,
       imagePath: url,
     });
     console.log("data",post);
    //  HomeSetting.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    //    .then(result => {
    //      if (result.n > 0) {
    //        res.status(200).json({ message: "Update successful!" });
    //      } else {
    //        res.status(401).json({ message: "Not authorized!" });
    //      }
    //    })
    //    .catch(error => {
    //      res.status(500).json({
    //        message: "Couldn't udpate post!"
    //      });
    //    });
   });