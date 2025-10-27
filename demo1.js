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

app.post("/registration", async function (req, res) {
  try {
    const d = req.body;
    const token = jwt.sign({ username: d.username, password: d.password }, key);
    const sql = `INSERT INTO users (username, usermobile, useremail, password, token) VALUES (?, ?, ?, ?, ?)`;
    const data = await exe(sql, [d.username, d.usermobile, d.useremail, d.password, token]);
    res.json({ success: true, message: "Registration successful!", token });

  } catch (err){
    console.error("Registration Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }

});

app.post("/login", async function (req, res) {
  try {
    const d = req.body;
    const sql = "SELECT * FROM users WHERE useremail = ? AND password = ?";
    const data = await exe(sql, [d.email, d.password]);

    if (data.length > 0) {
      const token = jwt.sign({ username: data[0].username, email: data[0].useremail },key);
      await exe("UPDATE users SET token=? WHERE useremail=?", [token, d.email]);

      res.json({success: true,message: "Login successful!",token: token,user: data[0],});
      
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Login Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});



app.listen(5000);
