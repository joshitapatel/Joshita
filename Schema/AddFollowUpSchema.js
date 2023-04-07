const mongoose = require("mongoose");
const followUpSchema = mongoose.Schema({
  enquiries_id: String,
  is_communicated: String,
  summery: String,
  next_followup_enquiries: String,
  next_followup_date_time: String,
});
module.exports = mongoose.model("followUp", followUpSchema);
