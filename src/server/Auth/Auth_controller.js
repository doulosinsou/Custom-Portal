const fetchData = require('../mysql')
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const verifyToken = require('./Verify_Token')
const cookies = require('cookies')

async function register(req, res, next) {
  console.log("received register request. About to process")
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const createUser = async (submit)=>{
    const existsQuery = "SELECT EXISTS( SELECT name from authentication WHERE name='"+submit.name+"')";
    const find = await fetchData(existsQuery);
    const exists = find[0][Object.keys(find[0])[0]];
    if (exists) return {nameExists:"Cannot use that Username"};

    const columns = ["name", "email", "pass"];
    const rows = ["'"+submit.name+"'", "'"+submit.email+"'", "'"+submit.password+"'"];
    const newRow = "INSERT INTO authentication ("+columns+") VALUES ("+rows+")";
    fetchData(newRow);
    return await fetchData("SELECT * FROM authentication WHERE name='"+submit.name+"'");
  }

  const created = await createUser({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  })

  if (!created) return req.data = "There was a problem registering the user";
  req.data = created;
  console.log("registered user "+created.name);
  next()
  };

async function login(req, res, next) {
  const query = "SELECT * FROM authentication WHERE name='"+req.body.name+"'";
  const find = await fetchData(query);

  if (find.err) res.status(500).send('Error on the server.');

  if (!find[0]) {
    res.status(401).send({auth: false, warning: "invalid username"});
    return;
  }

  if (!bcrypt.compareSync(req.body.password, find[0].pass)){
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
  }

  const cooks = new cookies(req,res);
  cooks.set("login", token, dets);
  res.status(200).send({ auth: true, token: token });
  }
};

exports.register = register;
exports.login = login;
