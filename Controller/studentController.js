const student = require("../Schema/studentSchema");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const formData = require("../Schema/studentSchema");
//=================================//student Vaklidation schema//=======================>>>>
const studentValidationSchema = Joi.object({
  name: Joi.string().min(2).max(5).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  mobileNumber: Joi.string().required(),
  whatsapp: Joi.string().required(),
  gender: Joi.string().required(),
  // dob: Joi.string().required(),
  address: Joi.string().required(),
  workingExp: Joi.string().required(),
  company: Joi.string().required(),
  coursename: Joi.string().required(),
  fees: Joi.string().required(),
  createdBy: Joi.string().required(),
});

//================================//student enquiry api//===============================>>>>
exports.addEnquiry = (req, res) => {
  const secret = "secretkey";
  try {
    const { error, value } = studentValidationSchema.validate(req.body, {
      aboutEarly: false,
    });
    if (error) {
      console.log(error);
      return res.send({ error: error });
    }
    const {
      name,
      email,
      mobileNumber,
      whatsapp,
      gender,
      dob,
      address,
      workingExp,
      company,
      coursename,
      fees,
      createdBy,
    } = req.body;
    const data = formData.create({
      name,
      email,
      mobileNumber,
      whatsapp,
      gender,
      dob,
      address,
      workingExp,
      company,
      coursename,
      fees,
      createdBy,
    });

    res.send("data is created successfully");
  } catch (err) {
    res.send("data is not created");
  }
};
//===============================//delete Api//===========================================>>>>

exports.deleteStudent = async (req, res) => {
  let { getid } = req.params;
  try {
    // let { studentid } = req.params;
    const deleted = await formData.findOneAndDelete({ _id: getid });
    res.send({
      status: "OK",
      msg: "Data updtate Successfully",
      data: deleted,
    });
  } catch (e) {
    res.send({ status: "error", msg: "something went wrong", data: null });
  }
};
//===============================//getStudentData//======================================>>>>

exports.getStudents = async (req, res) => {
  let { query, page, limit, sortBy, sortType } = req.body;
  const params = [
    "name",
    "mobileNumber",
    "email",
    "dob",
    "workingExp",
    "company",
    "course",
  ];

  page = page ? page : 1;
  limit = limit ? limit : 5;
  sortBy = sortBy ? sortBy : "name";
  sortType = sortType ? sortType : "ASC";
  try {
    let searchQuery = [];
    for (let each in params) {
      let key = params[each];
      let value = { $regex: `.*${query}.*`, $options: "i" };
      searchQuery.push({ [key]: value });
    }
    console.log(searchQuery);
    let datas = await formData.aggregate([
      { $match: { $or: searchQuery } },
      { $sort: { [sortBy]: sortType === "ASC" ? 1 : -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    let count = await formData.aggregate([
      { $match: {} },
      { $count: "totalRecords" },
      { $limit: limit },
    ]);
    res.send({
      status: "OK",
      msg: "Data Posted Successfully",
      data: { datas, count },
    });
  } catch (err) {
    console.log("Err ========> ", err);
    res.send({ status: "ERR", msg: "Something went wrong", data: null });
  }
};
//==============================//edit student data api==================================>>>>
exports.editstudent = async (req, res) => {
  const {
    name,
    email,
    mobileNumber,
    whatsapp,
    gender,
    dob,
    address,
    workingExp,
    company,
  } = req.body;

  let { getid } = req.params;
  try {
    // let { studentid } = req.params;
    const update = await formData.findOneAndUpdate(
      { _id: getid },
      {
        $set: {
          name,
          email,
          mobileNumber,
          whatsapp,
          gender,
          dob,
          address,
          workingExp,
          company,
        },
      }
    );
    res.send({
      status: "OK",
      msg: "Data updtate Successfully",
      data: update,
    });
  } catch (e) {
    res.send({ status: "error", msg: "something went wrong", data: null });
    console.log(e, "errrr");
  }
};
//==============================//single student data api================================>>>>
exports.singleStudents = async (req, res) => {
  let { getid } = req.params;
  console.log(getid);
  try {
    const datas = await formData.findById({ _id: getid });
    res.send({ status: "OK", msg: "Data updtate Successfully", data: datas });
  } catch (e) {
    res.send({
      status: "error",
      msg: "Data updtate Successfully",
      data: null,
    });
  }
};
