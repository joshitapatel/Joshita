const Enquiries = require("../Schema/EnquiriesSchema");

module.exports.addEnquiry = async (req, res) => {
  let { studentId } = req.params;
  const {
    enquiries_id,
    is_communicated,
    summery,
    next_followup_enquiries,
    next_followup_date_time,
  } = req.body;

  let EnquiryInserted = {
    enquiries_id,
    is_communicated,
    summery,
    next_followup_enquiries,
    next_followup_date_time,
  };
  try {
    // let { studentid } = req.params;
    await Enquiries.create(EnquiryInserted);
    res.send({ status: "OK", msg: "Data Posted Successfully", data: null });
  } catch (e) {
    res.send({ status: "error", msg: "Something went wrong" });
  }
};
