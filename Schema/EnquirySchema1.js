const mongoose = require("mongoose");
const enquirySchema = mongoose.Schema({
  enquiries_id: String,
  studentName: String,
  std_mobileNumber: String,
  feedback: String,
});
module.exports = mongoose.model("Enquiries", enquirySchema);
