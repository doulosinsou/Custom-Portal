const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
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
      activate: "http://localhost:3101/register/verify/"+req.data.token
    }
  }
  mailer(options);
  res.status(301).send({redirect: "/"});
})

router.get('/verify/:verify', async function(req,res){
  // console.log(req.params.verify);

  const update = "UPDATE authentication SET token= '', active='1' WHERE token='"+req.params.verify+"'";
  fetchData(update);
  res.redirect(301, '/activated');
})


async function register(req, res, next) {
  console.log("received register request. About to process")

  const hashedPassword = bcrypt.hashSync(req.body.pass, 8);

  const now = new Date().setHours(new Date().getHours() - 5);
  const newtime = new Date(now).toISOString().slice(0, 19).replace('T', ' ');

  const verifyCode = function(){
    const num = Math.floor((Math.random()*1000000)+1);
    console.log("random number is: "+num)
    let str = ''+num;
    while (str.length < 6){
      str = '0'+str;
    }

    const hashedVerify = bycrypt.hashSync(str, 8);
    return hashedVerify;
  }

//pass parameters of req data to above function
  const created = await createUser({
    name : req.body.name,
    email : req.body.email,
    pass : hashedPassword,
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

//helper to actually make new mysql table row
async function createUser(submit){
  if (await exists(submit.name)) {
    console.log(exists(submit.name));
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
  fetchData(newRow);
  return await fetchData("SELECT * FROM authentication WHERE name='"+submit.name+"'");
};

//helper function for if something already exists on the table
async function exists(something){
  const existsQuery = "SELECT EXISTS( SELECT name from authentication WHERE name='"+something+"')";
  const find = await fetchData(existsQuery);
  return await find[0][Object.keys(find[0])[0]];
}

module.exports = router;
