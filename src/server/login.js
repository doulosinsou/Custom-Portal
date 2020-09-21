const fetchData = require('./mysql')
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const verifyToken = require('./Verify_Token')
const cookies = require('cookies')

async function login(req, res, next) {
  const find = await fetchData.find("name", req.body.name);

  if (find.err) {
    res.status(500).send('Error on the server.');
    return
  }

  if (!find[0]) {
    res.status(401).send({auth: false, warning: "invalid username"});
    return;
  }

  if (!find[0].active) {
    res.status(401).send({auth: false, warning: "Your account is set to inactive. To activate, click on the link from your registration verification email or inquire of your portal administrator"});
    return;
  }

  if (!bcrypt.compareSync(req.body.password, find[0].pass)){
    console.log("bcrypt failed to match password");
    res.status(401).send({ auth: false, token: null, warning:"invalid password"});
  }else{
  const token = jwt.sign({id: find[0].ID}, process.env.SECRET, {
    expiresIn: 86400*7 // expires in 24 hours
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
  res.status(200).send({message: "Logged in"});
  }
};

// exports.register = register;
module.exports = login;
