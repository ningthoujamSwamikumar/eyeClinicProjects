const mongoose = require("mongoose");

//creates schema to store users who can enroll patientSchema
module.exports.userCompanySchema = new mongoose.Schema({
  username: String,
  regNo: String,
  address: String,
  email: String,
  password: String
});
