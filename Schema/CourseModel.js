const mongoose = require("mongoose");
const coursesData = new mongoose.Schema(
  {
    coursename: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("coursename", coursesData);
