const express = require('express');
const multer = require("multer");
var upload = multer({ dest: '../images/' })

const router = express.Router();
const HomeSetting = require('../model/homeSetting');


const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "images");
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

router.post('/api/bannerUpdate', multer({ storage: storage }).single("bannerImage"), async (req, res, next) => {
  console.log("req.body ", req.file);

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const banner = new HomeSetting({
    text_title: { 'banner': req.body.title },
    text_desc:  { 'description': req.body.description, 'image': imagePath }
  });

  const createdBanner = await banner.save()
    .then(result => {
      console.log("res : ", result);
      if (result) {
        res.status(201).json({
          ...banner._doc,
          message: 'Banner Uploaded Successfully.',
          response: true
        })
      } else {
        console.log("res data  : ", result);
      }
    })
    .catch(err => {
      console.log("Errr ==========> ", err);
    })
});


router.post('/api/seoDetails', async (req, res) => {
  const seoData = new HomeSetting({
    text_title:
    {
      'metaData': req.body.title
    },
    text_desc:
    {
      'description': req.body.description
    }
  });
  const seoDataUpdate = await seoData
    .save()
    .then(result => {
      if (result) {
        res.status(201).json({
          ...seoData._doc,
          message: 'Seo Details updated Successfully.',
          response: true
        })
      } else {
        console.log("res data  : ", result);
      }
    })
});

router.get("/api/metaInfo", (req, res) => {
    HomeSetting.find()
    .then( metaData => {
      if(metaData){
        res.status(200).json({
          message: 'success',
          data: metaData
        })
        for( const key in metaData){
          console.log(`${key}: ${metaData[key]}`);
        }
      }
    })
    .catch( err => {
      console.log("err : ", err);
    });  
});
module.exports = router;
