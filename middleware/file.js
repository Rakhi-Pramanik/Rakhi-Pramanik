const multer = require("multer");

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/svg": "svg"
  };

  const storage = multer.diskStorage({
      destination: (req, file, cb) =>{
        //   const isValid = MIME_TYPE_MAP[file.mimetype];
        //   let error = new Error("Invalid mime type");
        //   if(isValid){
        //       error = null;
        //   }
        //   cb(error, "uploads");
        cb(null,'./uploads');
      },
      filename: (req, file, cb) =>{
        //   const name = file.originalname
        //   .toLocaleLowerCase()
        //   .split(" ")
        //   .join("-");
        // const ext = MIME_TYPE_MAP[file.mimetype];
        // cb(null, name + "-" + Date.now() + "." + ext);
        cb(null, file.originalname);
      }
  });
//   module.exports = multer({ storage: storage }).single("image");
const uploadImg = multer({storage: storage}).single('image');
const newTea = new Tea({
    name:req.body.name,
    image: req.file.path,  //update this
    description: req.body.description,
});

module.exports = {
    getAllTea,
    uploadImg,  //include the new guy
    newTea,
    deleteAllTea,
    getOneTea,
    newComment,
    deleteOneTea
};