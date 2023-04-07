const imageSchema = require("../Schema/profileSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Joi = require("joi");
//====================multer for uploading file in multiple
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/; //check extension names

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only  Upload jpeg,jpg,png,gif,svg  type of Images!!");
  }
};

module.exports.uploadImage = async (req, res, next) => {
  try {
    const name = req.file.path;
    console.log(name);
    const file = req.file;
    console.log(file);
    const profiles = await profileSchema.create({ name });
    res.send({
      status: "OK",
      msg: "Everything is ok",
      data: { profiles, file },
    });
    // next();
  } catch (err) {
    res.send({ status: "ERR", msg: "Something went wrong", data: null });
  }
};
