const express = require('express');
const multer = require("multer");

const router = express.Router();
const HomeSetting = require('../model/homeSetting');

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("req : ", req, "file : ", file);
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "uploads/");
    console.log("file : ", file);
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post("/api/bannerUpdate",
multer({ storage: storage }).single('image'),
 (req, res, next) => {
   
     const url = req.protocol + "://" + req.get("host");
     console.log("req.body ",req.body, url);
     
    //  const post = new Post({
    //    title: req.body.title,
    //    content: req.body.description,
    //    image: url + "/images/" + req.file.filename,
    //  });
    //  console.log("data post: ",post);
     res.status(200).send({
       message: 'success'
     })
   });

   router.post(
    "",
    multer({ storage: storage }).single("image"),
    (req, res, next) => {
      const url = req.protocol + "://" + req.get("host");
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
      });
      post.save().then(createdPost => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            ...createdPost,
            id: createdPost._id
          }
        });
      });
    }
  );
   module.exports = router;