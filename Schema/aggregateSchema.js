const mongoose = require("mongoose");
const aggregateSchema = mongoose.Schema({
  enquiries_id: String,
  is_communicated: String,
  summery: String,
  next_followup_enquiries: String,
  next_followup_date_time: String,
});
module.exports = mongoose.model("StudentData", aggregateSchema);
