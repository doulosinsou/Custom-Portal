const fetchData = require('./mysql')
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const verifyToken = require('./Verify_Token')
const cookies = require('cookies')
//
// async function register(req, res, next) {
//   console.log("received register request. About to process")
//   const hashedPassword = bcrypt.hashSync(req.body.pass, 8);
//
//   const verifyCode = function(){
//     const num = Math.floor((Math.random()*1000000)+1);
//     console.log("random number is: "+num)
//     let str = ''+num;
//     while (str.length < 6){
//       str = '0'+str;
//     }
//     return str;
//   }
//
// //pass parameters of req data to above function
//   const created = await createUser({
//     name : req.body.name,
//     email : req.body.email,
//     pass : hashedPassword,
//     token: verifyCode(),
//     active: false,
//   });
//
// //call the created const
//   if (!created) return req.data = "There was a problem registering the user";
//   if (created.nameExists) return res.status(401).send(created);
//   req.data = created;
//   console.log("registered user "+created[0].name);
//   next()
// };
//
// //helper to actually make new mysql table row
// async function createUser(submit){
//   if (!exists(submit.name)) {
//     console.log("submition name exists")
//     return {nameExists:"Cannot use that Username"};
//   }
//   //build the row based on parameters of the object passed to it
//   let columns =[];
//   let rows = [];
//   for (param in submit){
//     const value = submit[param];
//     columns.push(param);
//     rows.push("'"+value+"'");
//   }
//
//   const newRow = "INSERT INTO authentication ("+columns+") VALUES ("+rows+")";
//   fetchData(newRow);
//   return await fetchData("SELECT * FROM authentication WHERE name='"+submit.name+"'");
// };
//
// //helper function for if something already exists on the table
// async function exists(something){
//   const existsQuery = "SELECT EXISTS( SELECT name from authentication WHERE name='"+something+"')";
//   const find = await fetchData(existsQuery);
//   return await find[0][Object.keys(find[0])[0]];
// }


// new process
async function login(req, res, next) {
  const query = "SELECT * FROM authentication WHERE name='"+req.body.name+"'";
  const find = await fetchData(query);

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
  res.status(200).send({message: "Logged in"});
  }
};

// exports.register = register;
exports.login = login;
