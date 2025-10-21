const express = require("express");
const util = require("util");
const mysql = require("mysql");

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"App_demo_Api"
});

const exe = util.promisify(conn.query).bind(conn);

module.exports = exe ;