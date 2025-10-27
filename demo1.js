const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const exe = require("./conn");
const jwt = require("jsonwebtoken");
const key = "sdfghjkl"

const app = express();
app.use(cors());
app.use(bodyParser.json());

let otpStore = {};

app.get("/",function(req,res){
  res.send("Data")
})

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "dattapadre7249@gmail.com",
      pass: "ibip cill mvek iypo",
    },
  });

  const mailOptions = {
    from: "dattapadre7249@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully", otp: otp });
  } catch (error) {
    res.json({ success: false, message: "Failed to send OTP", error });
  }
});

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    res.json({ success: true, message: "OTP verified successfully!" });
  } else {
    res.json({ success: false, message: "Invalid OTP" });
  }
});

app.post("/registration",async function(req,res){
  var d = req.body;
  var token = jwt.sign({username:d.username,password:d.password},key)
  var sql = `INSERT INTO users (username, usermobile, useremail, password) VALUES (?, ?, ?, ?,?)`;
  // var data = await exe(sql, [d.username, d.mobile, d.email, d.password,token]);
  res.json({ success: true, message: "Registration successfully!" });
});


app.listen(5000);
