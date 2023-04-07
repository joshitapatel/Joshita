const register = require("../Schema/registerSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const Joi = require("joi");

//===============================//Register validation schema//=======================>>>
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(5).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  // password: Joi.string().min(1).max(6).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmPassword: Joi.ref("password"),
  // mobileNumber: Joi.string().min(1).max(10).required(),
});

//=================================//Register api//=================================>>>

module.exports.registered = async (req, res) => {
  //   const { name, email, password, confirmPassword, mobileNumber } = req.body;
  try {
    let { name, email, password, confirmPassword, mobileNumber } = req.body;
    const { error, value } = registerSchema.validate(req.body, {
      aboutEarly: false,
    });
    if (error) {
      console.log(error);
      return res.send({ error: error });
    }
    let regStudent = await bcrypt.hash(password, saltRounds);
    console.log(regStudent);
    let registerToInsert = {
      name,
      email,
      password: regStudent,
      confirmPassword,
      mobileNumber,
    };
    console.log(regStudent);
    let registered = await register.create(registerToInsert);
    console.log(registered);
    res.send({
      status: "OK",
      msg: "Data updtate Successfully",
      data: registered,
    });
  } catch (err) {
    res.send({ status: "error", msg: "something went wrong", data: null });
    console.log("error");
  }
};

//===============================//Login Validation Schema//=======================>>>

const loginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  // password: Joi.string().min(1).max(6).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

//===============================//=====Login Api======//=======================>>>
exports.addLogin = async (req, res) => {
  let { email, password } = req.body;
  const { error, value } = loginSchema.validate(req.body, {
    aboutEarly: false,
  });
  if (error) {
    console.log(error);
    return res.send({ error: error });
  }
  const secret = "mysecretkey";
  try {
    let login = await register.findOne({ email });
    if (!login) {
      res.send("USER NOT FOUND IN REGISTRATION");
    } else {
      bcrypt.compare(password, login.password).then(function (result) {
        let token = jwt.sign({ _id: login._id }, secret);
        console.log(token);
        result
          ? res.send({
              status: "OK",
              msg: "Data update successfully",
              data: login,
              token,
              //   msg: "login successfully",
              //   data: data,
            })
          : res.send({ msg: "can not login " });
      });
    }
  } catch (err) {
    res.send({
      msg: "something went wrong in registration",
      error: err.msg,
    });
    console.log(err, "errrr");
  }
};
