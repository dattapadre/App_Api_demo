const express = require("express");
const util = require("util");
const mysql = require("mysql");

const conn = mysql.createConnection({
    host:"bpgfufgwaio3r9syvurk-mysql.services.clever-cloud.com",
    user:"uw2o79u5rurzlnwn",
    password:"3h9Fgdz2LpoNV1oChpMv",
    database:"bpgfufgwaio3r9syvurk"
});

const exe = util.promisify(conn.query).bind(conn);

module.exports = exe ;