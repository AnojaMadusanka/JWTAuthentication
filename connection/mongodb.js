const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const url =process.env.DB_CONNECT

mongoose.connect(url, {useNewUrlParser:true});
const con = mongoose.connection;

module.exports = con;