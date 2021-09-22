const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const url = require("url");
const querystring = require("querystring");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const formData = require(__dirname+"/formData.js");
const userDataModule = require(__dirname+"/userData.js")
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));
//for session and cookies
app.use(session({
  // secret: process.env.MY_SECRET,
  secret: "IloveYouBABimywiF3",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//mongo atlas connection uri
const myUrl = process.env.MONGO_DB_URL;

mongoose.connect(myUrl, {  useNewUrlParser: true, useUnifiedTopology: true });
//for deprecation warnings
mongoose.set("useCreateIndex", true);

//define shemas to use in database
const patientSchema = formData.formSchema;
const usersSchema = userDataModule.userCompanySchema;
//add plugin to mongoose schema to hash and salt password
usersSchema.plugin(passportLocalMongoose);
//define models of the schemas
const Patient = mongoose.model("Patient", patientSchema);
const User = mongoose.model("User", usersSchema);
//setup passport-local configurations
passport.use(User.createStrategy());
passport.serializeUser(function(user,done){
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

//get request handler on home route
app.get("/", (req, res) => {
  res.render("home");
});
//get request handler on home/about route
app.get("/about", (req, res) => {
  res.render("about");
});
//get request handler on home/pricing route
app.get("/pricing", (req, res) => {
  res.render("pricing");
});
//get request handler on home/contact route
app.get("/contact", (req, res) => {
  res.render("contact");
});
//get and post request handler on home/register route
app.get("/register", (req, res) => {
  const failMsg = req.query.failMsg;
  if(failMsg){
    res.render("register", {causeOfError: failMsg});
  }else if(!failMsg){
    res.render("register", {causeOfError: ""});
  }
});
app.post("/register", (req, res) => {
    User.register({
      username: req.body.username,
      regNo: req.body.companyRegNo,
      address: req.body.companyAddress,
      email: req.body.companyEmail
    }, req.body.password, function(err, user) {
      if(err) {
        console.log(err);
        res.redirect("/register/?failMsg="+err.message);
      }else{
            passport.authenticate("local")(req, res, function() {
              res.redirect("/dashboard");
        });
      }
    });
});
//get and post request handler on home/login route
app.get("/login", (req, res) => {
  if(req.query.failMsg){
    res.render("login", {loginErrMsg:req.query.failMsg});
  }else{
    res.render("login", {loginErrMsg:""});
  }
});
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  req.login(user, function(err){
    if(err){
      console.log(err);
      res.redirect("/login/?failMsg="+err.message);
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/dashboard");
      });
    }
  });
});
//get request handler on home/logout route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
//get request handler on home/dashboard
app.get("/dashboard", (req, res) => {
  if(req.isAuthenticated()){
    res.render("dashboard", {foundPatients:[], searchResult: "", companyName: req.user.username});
  }else{
    res.redirect("/login");
  }
});
//post request handler on home/dashboard/patient
app.post("/dashboard/patient/save", (req, res) => {
  if(req.isAuthenticated()){
    const postedData = req.body;
    formData.saveForm(Patient, postedData);
    res.render("template/prescription-template",
     {fullName: postedData.fullname, dateTime: postedData.datetime, address: postedData.address,
       ageSex: postedData.agesex, rxpSl: postedData.rxpSl, rxpEye: postedData.rxpEye, rxpDose: postedData.rxpDose,
       rxpDrug: postedData.rxpDrug, rxpDuration: postedData.rxpDuration, rxpStartDate: postedData.rxpStartDate,
       rxpEndDate: postedData.rxpEndDate, gpDVrightSPH: postedData.gpDVrightSPH, gpDVrightCYL: postedData.gpDVrightCYL,
       gpDVrightAXIS: postedData.gpDVrightAXIS, gpDVrightVA: postedData.gpDVrightVA, gpDVleftSPH: postedData.gpDVleftSPH,
       gpDVleftCYL: postedData.gpDVleftCYL, gpDVleftAXIS: postedData.gpDVleftAXIS, gpDVleftVA: postedData.gpDVleftVA,
       gpNVrightSPH: postedData.gpNVrightSPH, gpNVrightCYL: postedData.gpNVrightSPH, gpNVrightAXIS: postedData.gpNVrightAXIS,
       gpNVrightVA: postedData.gpNVrightVA, gpNVleftSPH: postedData.gpNVleftSPH, gpNVleftCYL: postedData.gpNVleftCYL,
       gpNVleftAXIS: postedData.gpNVleftAXIS, gpNVleftVA: postedData.gpNVleftVA, company: req.user.username
      });
  }else{
    res.redirect("/login");
  }

});
//get request handler on home/template/clinical route
app.post("/dashboard/patient/search", (req, res) => {
  if(req.isAuthenticated()){
    Patient.find({name: req.body.patientName}, "name address agesex", function(err, docs){
      if(!err){
        res.render("dashboard", {foundPatients: docs, companyName:req.user.username, searchResult:"Found "+docs.length+" results !"});
      }else{ console.log(err); }
    });
  }else{
    res.redirect("/login");
  }
});
app.post("/dashboard/patient/foundClinical", (req,res)=>{
  if(req.isAuthenticated()){
    const id = Object.values(req.body)[0];
    Patient.findById(id, function(err, foundDoc){
      if(!err){
        res.render("template/clinical-template", {patient: foundDoc});
      }else{
        console.log(err);
      }
    });
  }else{
    res.redirect("/login");
  }
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port: "+port);
});
