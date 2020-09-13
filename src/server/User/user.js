<<<<<<< HEAD
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
||||||| 31cd467... successful name response for logged in user
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const createUser = require('../User/user').create;
=======
// const mysql = require('mysql');
// const dotenv = require('dotenv').config();
>>>>>>> parent of 31cd467... successful name response for logged in user
const fetchData = require('../mysql');
const maViews = require('../views/process');

<<<<<<< HEAD
// app.engine('ma', maViews);
// app.set('views', '../views/templates'); // specify the views directory
// app.set('view engine', 'ma'); // register the template engine
||||||| 31cd467... successful name response for logged in user
=======
// const pool = mysql.createPool({
//   connectionLimit : 5,
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE
// });
>>>>>>> parent of 31cd467... successful name response for logged in user

<<<<<<< HEAD
let query;

router.get('/', async function (req,res,next){
  query = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
  const call = await fetchData(query);
  const me = call[0];
  me.pass = "";
  me.ID = "";
  res.render('index', me);


  // res.send(me[0]);
  // console.log("const me response:")
  // console.log(me);
||||||| 31cd467... successful name response for logged in user
router.get('/me', async function (req,res,next){
  console.log('made get request to /portal/me');
  const query = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
  const me = await fetchData(query);
  me[0].pass = "";
  me[0].ID = "";
  res.send(me[0]);
  // console.log("const me response:")
  // console.log(me);
=======
async function createUser(submit){
  const existsQuery = "SELECT EXISTS( SELECT name from authentication WHERE name='"+submit.name+"')";
  const find = await fetchData(existsQuery);
  const exists = find[0][Object.keys(find[0])[0]];
  if (exists) return {nameExists:"Cannot use that Username"};
  // return find;
>>>>>>> parent of 31cd467... successful name response for logged in user

  const columns = ["name", "email", "pass"];
  const rows = ["'"+submit.name+"'", "'"+submit.email+"'", "'"+submit.password+"'"];
  const newRow = "INSERT INTO authentication ("+columns+") VALUES ("+rows+")";
  fetchData(newRow);
  const newUser = await fetchData("SELECT * FROM authentication WHERE name='"+submit.name+"'");

  return newUser;
}



exports.create = createUser;
