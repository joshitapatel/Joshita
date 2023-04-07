// const formData = require("./Schema/studentSchema");
// const coursesData = require("./Schema/CourseModel");
// const enquiryData = require("./Controller/enquiryController");
// const Enquiries = require("./Schema/EnquiriesSchema");
// const followUp = require("./Schema/AddFollowUpSchema");

const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const profileSchema = require("./Schema/profileSchema");
const jwt = require("jsonwebtoken");
const secret = "mysecretkey";
const cors = require("cors");
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const formData = require("./Schema/studentSchema");
//=============================import Controller==================>>>>
const studentController = require("./Controller/studentController");
const login = require("./Controller/loginController");
const courseController = require("./Controller/courseController");
const enquiryController = require("./Controller/enquiryController");
// const uploadImageController = require("./Controller/uplodImageController");
// const upload = multer({ dest: "./public/data/uploads/" });
// const path = require("path");

const { default: axios } = require("axios");
const app = express();
////////=================cor and body parser===================>>>>>
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
//======================================getting all data on database api================>>>>>>>>
const URL = `mongodb+srv://Joshita:1346790@patel.5imtl89.mongodb.net/formData?retryWrites=true&w=majority`;
console.log("connected successfully");
mongoose
  .connect(URL)
  .then((res) => {
    console.log("==================== database connected ===> ");
  })
  .catch((err) => {
    console.log(
      "====================databse connections error===========>",
      err
    );
  });
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

///==================================token verification====================>>>>>>>>>>>
const tokenVerify = async (req, res, next) => {
  const token = await req.headers.autherization;
  // const secret = "secretkey";s
  console.log(token, "------");
  try {
    if (token === null) {
      console.log("token Provided ------");
    } else {
      let decode = jwt.verify(token, secret);
      req.register = decode;
      console.log(decode, "decode");
      next();
    }
  } catch (err) {
    res.send({ status: "err", msg: "token is invalid" });
    console.log("=============>//invalid token//>==============>>>");
  }
};

//----------------------------------------REGISTER AND LOGIN APIS--------------------->>>>>>>>>>>
app.post("/register", login.registered);
app.post("/login", login.addLogin);

//----------------------------------------student data----------------->>>>>>>>>>>>
// app.post("/student", async (req, res) => {
//   // const { error, value } = schema.validate(req.body);
//   // if (error) {
//   //   console.log(error);
//   //   return res.send(error.invalid, "Invalid Request");
//   // }
//   // res.send("successfully sign up..!!");
//   try {
//     const data = await formData.find({});
//     res.send({ status: "OK", msg: "Data update Successfully", data: data });
//   } catch (err) {
//     res.send({ status: "error", msg: "something went wrong", data: null });
//   }
// });

app.post("/student", tokenVerify, studentController.addEnquiry);
app.delete("/studentData/:getid", tokenVerify, studentController.deleteStudent);
app.post("/studentData", tokenVerify, studentController.getStudents);
app.put(
  "/studentUpdateData/:getid",
  tokenVerify,
  studentController.editstudent
);
app.get("/studentData/:getid", tokenVerify, studentController.singleStudents);

//------------------------------------enquiry-------------------------->>>>>>>>>
app.post("./get-all-enquiry", enquiryController.addEnquiry);

//-----------------------------------upload file------------------------>>>>>>>>
app.post("/upload", upload.single("image"), async (req, res, next) => {
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
});

////=============================COURSES ROUTE=====================================================>

app.post("/course", courseController.postCourse); //posted data on mongodb
app.get("/courses", courseController.getCourse); //then get data on frontent

console.log(__dirname);
console.log(__filename);
//===================================filter=============================================>>>>>>>

// Enquiries added to the DataBase ......================================================>
// app.get("/get-followup-by-enquiry/:studentId", async (req, res) => {
//   let { studentId } = req.params;
//   const {
//     enquiries_id,
//     is_communicated,
//     summery,
//     next_followup_enquiries,
//     next_followup_date_time,
//   } = req.body;

//   let EnquiryInserted = {
//     enquiries_id,
//     is_communicated,
//     summery,
//     next_followup_enquiries,
//     next_followup_date_time,
//   };
//   try {
//     // let { studentid } = req.params;
//     await Enquiries.create(EnquiryInserted);
//     res.send({ status: "OK", msg: "Data Posted Successfully", data: null });
//   } catch (e) {
//     res.send({ status: "error", msg: "Something went wrong" });
//   }
// });

app.post("/filter", async (req, res) => {
  try {
    const { courseData, minFees, maxFees } = req.body;
    const param = ["coursename", "fees"];
    const filterData = await data.aggregate([
      {
        $match: {
          $and: [
            { course: { $in: courseData } },
            { fees: { $gt: minFees, $lt: maxFees } },
          ],
        },
      },
    ]);
    res.send({
      status: "Ok",
      msg: "data posted successfully",
      data: filterData,
    });
  } catch (err) {
    res.send({ status: "err", msg: "something went wrong", data: null });
  }
});

app.listen(1001, () => {
  console.log("Server is running");
});

///course=================>// async (req, res) => {
//   const { coursename } = req.body;
//   let courseInsert = { coursename };
//   // let { getid } = req.params;
//   try {
//     let courses = await coursesData.create(courseInsert);
//     res.send({
//       status: "OK",
//       msg: "Data updtate Successfully",
//       data: courseInsert,
//     });
//     console.log(courses);
//     // console.log(courses);
//   } catch (e) {
//     res.send({ status: "error", msg: "something went wrong" });
//   }
// });
//==============
// async (req, res) => {
//   try {
//     const coursename = await coursesData.find({});
//     res.send({
//       status: "OK",
//       msg: "Data updtate Successfully",
//       data: coursename,
//     });
//   } catch (e) {
//     res.send({
//       status: "error",
//       msg: "something went wrong",
//       data: coursename,
//     });
//   }
// });
//student============================
// app.get("/studentData", async (req, res) => {
//   let data = await formData.find({});
//   res.send(data);
// });

// =======================================AGGREGATION;==============================================>

// async (req, res) => {
//   let { query, page, limit, sortBy, sortType } = req.body;
//   const params = [
//     "name",
//     "mobileNumber",
//     "email",
//     "dob",
//     "workingExp",
//     "company",
//   ];
//   page = page ? page : 1;
//   limit = limit ? limit : 5;
//   sortBy = sortBy ? sortBy : "name";
//   sortType = sortType ? sortType : "ASC";
//   try {
//     let searchQuery = [];
//     for (let each in params) {
//       let key = params[each];
//       let value = { $regex: `.*${query}.*`, $options: "i" };
//       searchQuery.push({ [key]: value });
//     }
//     // const matchArray = ["name"];
//     console.log(searchQuery);

//     // let searchQuery = [];
//     // let key = ["name"];
//     // let value = { $regex: `.*${query}.*`, $options: "i" };
//     // searchQuery.push({ [key]: value });

//     let datas = await formData.aggregate([
//       { $match: { $or: searchQuery } },
//       { $sort: { [sortBy]: sortType === "ASC" ? 1 : -1 } },
//       { $skip: (page - 1) * limit },
//       { $limit: limit },
//     ]);
//     // .then((res) => {
//     //   console.log("formData response ======>", res);
//     // })
//     // .catch((err) => {
//     //   console.log("formData Err ========>", err);
//     // });

//     let count = await formData.aggregate([
//       { $match: {} },
//       { $count: "totalRecords" },
//       { $limit: limit },
//     ]);
//     res.send({
//       status: "OK",
//       msg: "Data Posted Successfully",
//       data: { datas, count },
//     });
//   } catch (err) {
//     console.log("Err ========> ", err);
//     res.send({ status: "ERR", msg: "Something went wrong", data: null });
//   }
// };

//  async (req, res) => {
//   let { getid } = req.params;
//   console.log(getid);
//   let data = await formData.find({ _id: getid });
//   res.send(data);
// });
//========================================================CLOSE AGGREGATION====================>

//async (req, res) => {
//   const {
//     name,
//     email,
//     mobileNumber,
//     whatsapp,
//     gender,
//     dob,
//     address,
//     workingExp,
//     company,
//   } = req.body;

//   let { getid } = req.params;
//   try {
//     // let { studentid } = req.params;
//     await formData.findOneAndUpdate(
//       { _id: getid },
//       {
//         $set: {
//           name,
//           email,
//           mobileNumber,
//           whatsapp,
//           gender,
//           dob,
//           address,
//           workingExp,
//           company,
//         },
//       }
//     );
//     res.send({ status: "OK", msg: "Data updtate Successfully", data: null });
//   } catch (e) {
//     res.send({ status: "error", msg: "Data updtate Successfully", data: null });
//   }
// });

//  async (req, res) => {
//   let { getid } = req.params;
//   try {
//     // let { studentid } = req.params;
//     await formData.findOneAndDelete({ _id: getid });
//     res.send({ status: "OK", msg: "Data updtate Successfully", data: null });
//   } catch (e) {
//     res.send({ status: "error", msg: "something went wrong", data: null });
//   }
// };

// app.post("/course", (req, res) => {
//   const { coursename } = req.body;
//   let courseToInsert = { coursename };
//   coursesData
//     .create({
//       coursename,
//     })
//     .then((db) => {
//       res.send({
//         status: "OK",
//         msg: "Data updated Successfully",
//         data: courseToInsert,
//       });
//       console.log(coursename);
//     })
//     .catch(() => {
//       res.send({ status: "error", msg: "something went wrong", data: null });
//     });
// });
// app.get("/course", async (req, res) => {
//   try {
//     // let { studentid } = req.params;
//     const courses = await coursesData.find({});
//     res.send({ status: "OK", msg: "Data updtate Successfully", data: courses });
//   } catch (e) {
//     res.send({ status: "error", msg: "something went wrong", data: null });
//   }
// });

// Enquiries added to the DataBase ......================================================>
// app.get("/get-followup-by-enquiry/:studentId", async (req, res) => {
//   let { studentId } = req.params;
//   const {
//     enquiries_id,
//     is_communicated,
//     summery,
//     next_followup_enquiries,
//     next_followup_date_time,
//   } = req.body;

//   let EnquiryInserted = {
//     enquiries_id,
//     is_communicated,
//     summery,
//     next_followup_enquiries,
//     next_followup_date_time,
//   };
//   try {
//     // let { studentid } = req.params;
//     await Enquiries.create(EnquiryInserted);
//     res.send({ status: "OK", msg: "Data Posted Successfully", data: null });
//   } catch (e) {
//     res.send({ status: "error", msg: "Something went wrong" });
//   }
// });

// app.post("/add-followup", async (res, req) => {
//   // let { studentId } = req.params;
//   const {
//     enquiries_id,
//     is_communicated,
//     summery,
//     next_followup_enquiries,
//     next_followup_date_time,
//   } = req.body;

//   let followUpEnquiry = {
//     enquiries_id,
//     is_communicated,
//     summery,
//     next_followup_enquiries,
//     next_followup_date_time,
//   };
//   try {
//     // let { studentid } = req.params;
//     await followUp.create(followUpEnquiry);
//     res.send({ status: "OK", msg: "Data Posted Successfully", data: null });
//   } catch (e) {
//     res.send({ status: "error", msg: "Something went wrong" });
//   }
// });

// // app.get("/studentData", async (req, res) => {
// //   // const { q, page, limit, sortBy, sortType } = req.body;
// //   try {
// //     let data = await formData.find({
// //       $or: [{ $regex:name:{$regex:'joshita',option:'ae'} }],
// //     });
// //     res.send({ status: "OK", msg: "Data Posted Successfully", data });
// //   } catch (err) {
// //     res.send({ status: "ERR", msg: "Something went wrong", data: null });
// //   }
// // });

// app.post("/studentData", async (req, res) => {
//   try {
//     const { query, page, limit, sortBy, sortType } = req.body;
//     const params = [
//       "name",
//       "mobileNumber",
//       "email",
//       "dob",
//       "workingExp",
//       "company",
//     ];
//     console.log(query);
//     let searchQuery = [];
//     for (let each in params) {
//       let key = params[each];
//       let value = { $regex: `.*${query}.*`, $options: "i" };
//       searchQuery.push({ [key]: value });
//     }
//     // const matchArray=['name']
//     console.log(searchQuery);

//     let data = await formData.aggregate([
//       { $match: { $or: searchQuery } },

//       // { $sort: { [sortBy]: sortType === "ASC" ? 1 : -1 } },
//       // { $skip: (page - 1) * limit },
//       // { $limit: limit },
//       //   {$lookup:}
//     ]);
//     res.send({ status: "OK", msg: "Data Posted Successfully", data: data });
//   } catch (err) {
//     res.send({ status: "ERR", msg: "Something went wrong", data: null });
//   }
// });
