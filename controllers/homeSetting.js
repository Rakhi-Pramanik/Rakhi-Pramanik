const HomeSetting = require('../model/homeSetting');

exports.updatePost = async (req, res, next) => {
   const { name } = req.body;
    const url = req.protocol + "://" + req.get("host");
    console.log("req.body ",req.body);

    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const banner = new HomeSetting({
      title: req.body.title,
      description: req.body.content,
      image: url,
    });

    const createdBanner = await banner.save();
    res.status(201).json({
      ...banner._doc
    })
  }
 