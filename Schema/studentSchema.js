const mongoose = require("mongoose");

const formData = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobileNumber: Number,
    whatsapp: String,
    gender: String,
    dob: Date,
    address: String,
    workingExp: String,
    company: String,
    coursename: String,
    fees: Number,
    createdBy: String,
    // timestamp: True,
  },
  { timestamps: true }
);
module.exports = mongoose.model("data", formData);

// const mongoose = require("mongoose");
// const studentData = mongoose.Schema({
//   //   enquiries_id: String,
//   sn: String,
//   stuentName: String,
//   studentMobileNumber: String,
//   studentEmail: String,
//   studentDob: String,
//   gender: String,
//   address: String,
//   workingExp: String,
//   company: String,
//   coursename: String,
//   fees: Number,
// });
// module.exports = mongoose.model("students", studentData);
