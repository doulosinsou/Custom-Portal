const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const path = require('path');
const bcrypt = require('bcryptjs');
const fetchData = require('./mysql')
const mailer = require('./mail/mail_handler');

router.post('/request', register, function (req,res,next){
  console.log(req.data);

  const options = {
    to: req.data.email,
    subject: "Verify Account",
    template: "register",
    match: {
      activate: "http://localhost:3111/register/reset/?token="+req.data.token
    }
  }
  mailer(options);
  res.status(301).send({redirect: "/"});
})

router.get('/reset', function(req,res){
  res.sendFile(path.resolve("src/client/reset.html"));
})

router.post('/verify', async function(req,res){
  const email = req.body.email
  const exi = await exists("email", "email", email);
  if (!exi){
    res.status(401).send({noEmail: "Cannot find account with this email"});
    return
  }

  const token = verifyCode();
  fetchData.update({token:token}, "email", email);

  const options = {
    to: email,
    subject: "Verify Account",
    template: "passreset",
    match: {
      reset: "http://localhost:3111/register/reset/?token="+token
    }
  }
  mailer(options);
  // res.status(301).send({redirect: "/"});
});

router.post('/newPass', async function(req,res){
  // console.log(req.params.token);

  const find = await fetchData.find("token", req.body.token);
  // console.log(req.body.token);
  // return
  const hashedPassword = bcrypt.hashSync(req.body.pass, 8);
  fetchData.update({pass:hashedPassword}, "token", req.body.token);
  console.log("resetting password for user "+find[0].name);
  // res.status(200).send({success: "successful password reset"})
  const update = "UPDATE authentication SET token= '', active='1' WHERE token='"+req.params.token+"'";
  fetchData.allsql(update);
  res.status(301).send({redirect:'/activated'});
})



async function register(req, res, next) {
  console.log("received register request. About to process")

  const hashedPassword = bcrypt.hashSync(req.body.pass, 8);

  const now = new Date().setHours(new Date().getHours() - 5);
  const newtime = new Date(now).toISOString().slice(0, 19).replace('T', ' ');

//pass parameters of req data to above function
  const created = await createUser({
    name : req.body.name,
    email : req.body.email,
    // pass : hashedPassword,
    token: verifyCode(),
    active: false,
    signup: newtime
  });

//call the created const
  if (!created) return req.data = "There was a problem registering the user";
  if (created.nameExists) return res.status(401).send(created);
  req.data = created[0];
  console.log("registered user "+created[0].name);
  next()
};

// helper to assign randomized token
function verifyCode(){
  const num = Math.floor((Math.random()*1000000)+1);
  console.log("random number is: "+num)
  let str = ''+num;
  while (str.length < 6){
    str = '0'+str;
  }
  const hashedVerify = bcrypt.hashSync(str, 8);
  return hashedVerify;
}

//helper to actually make new mysql table row
async function createUser(submit){
  if (await exists("name", "name", submit.name)) {
    // console.log(exists(submit.name));
    console.log("submition name exists")
    return {nameExists:"Cannot use that Username"};
  }
  //build the row based on parameters of the object passed to it
  let columns =[];
  let rows = [];
  for (param in submit){
    const value = submit[param];
    columns.push(param);
    rows.push("'"+value+"'");
  }

  const newRow = "INSERT INTO authentication ("+columns+") VALUES ("+rows+")";
  fetchData.allsql(newRow);
  return await fetchData.find("name", submit.name);
};

//helper function for if something already exists on the table
async function exists(object, column, something){
  const existsQuery = "SELECT EXISTS( SELECT "+object+" from authentication WHERE "+column+"='"+something+"')";
  const find = await fetchData.allsql(existsQuery);
  return await find[0][Object.keys(find[0])[0]];
}

module.exports = router;
