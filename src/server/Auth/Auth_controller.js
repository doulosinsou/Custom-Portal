const express = require('express');
// const router = express.Router();
// const bodyParser = require('body-parser');
// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json());
// const createUser = require('../User/user').create;
const fetchData = require('../mysql')
const dotenv = require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

const verifyToken = require('./Verify_Token')
// const cookieParser = require('cookie-parser');
const cookies = require('cookies')


async function register(req, res, next) {
  console.log("received register request. About to process")
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const created = await createUser(
    {
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  })

  async function createUser(submit){
    const existsQuery = "SELECT EXISTS( SELECT name from authentication WHERE name='"+submit.name+"')";
    const find = await fetchData(existsQuery);
    const exists = find[0][Object.keys(find[0])[0]];
    if (exists) return {nameExists:"Cannot use that Username"};
    // return find;

    const columns = ["name", "email", "pass"];
    const rows = ["'"+submit.name+"'", "'"+submit.email+"'", "'"+submit.password+"'"];
    const newRow = "INSERT INTO authentication ("+columns+") VALUES ("+rows+")";
    fetchData(newRow);
    const newUser = await fetchData("SELECT * FROM authentication WHERE name='"+submit.name+"'");

    return newUser;
  }


  if (!created) req.data = "There was a problem registering the user";

  req.data = created;
  console.log("registered user")

  next()

  };

async function login(req, res, next) {
  // console.log("login function declared; about to find name in database")
  const query = "SELECT * FROM authentication WHERE name='"+req.body.name+"'";
  const find = await fetchData(query);

  if (find.err) res.status(500).send('Error on the server.');

  if (!find[0]) {
    res.status(401).send({auth: false, warning: "invalid username"});
    return;
  }
  console.log("bcrypt returns: "+bcrypt.compareSync(req.body.password, find[0].pass));

  const validPass = bcrypt.compareSync(req.body.password, find[0].pass);
  if (!validPass)
  {
    console.log("bcrypt failed to match password");
    res.status(401).send({ auth: false, token: null });
  }else{
  const token = jwt.sign({id: find[0].ID}, process.env.SECRET, {
    expiresIn: 86400 // expires in 24 hours
  });
  console.log(find[0].name+" has just logged in");
  const sixmo = 1000*60*60*24*30*6; //mill*sec*min*hours*days*months
  const dets = {
    maxAge: sixmo,
    secure: false, //follow up SSL
    httpOnly: false,
    path: '/',
    signed: false
    // overwrite:true
  }

  const cooks = new cookies(req,res);
  cooks.set("login", token, dets);

  // res.cookie("login", token, dets).send('cookie set');

  res.status(200).send({ auth: true, token: token });

  }

};

// router.get('/portal', verifyToken, async function(req,res,next){
//     const query = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
//     const user = await fetchData(query);
//     if (user.err) {
//       return res.status(500).send("There was a problem finding the user.");
//     }else{
//       user[0].pass = "";
//       user[0].ID = "";
//       console.log(user[0].name+" is now logged in");
//       res.status(200).send(user[0]);
//   }
// })


exports.register = register;
exports.login = login;
