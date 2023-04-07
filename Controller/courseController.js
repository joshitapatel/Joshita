const coursesData = require("../Schema/CourseModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//==================================post course name api=============================>>>>
module.exports.postCourse = async (req, res) => {
  const { coursename } = req.body;
  let courseInsert = { coursename };
  // let { getid } = req.params;
  try {
    let courses = await coursesData.create(courseInsert);
    res.send({
      status: "OK",
      msg: "Data updtate Successfully",
      data: courseInsert,
    });
    console.log(courses);
    // console.log(courses);
  } catch (e) {
    res.send({ status: "error", msg: "something went wrong" });
  }
};
//==========================get course name api========================>>>>>>>>>>>

module.exports.getCourse = async (req, res) => {
  try {
    const coursename = await coursesData.find({});
    res.send({
      status: "OK",
      msg: "Data updtate Successfully",
      data: coursename,
    });
  } catch (e) {
    res.send({
      status: "error",
      msg: "something went wrong",
      data: null,
    });
  }
};
