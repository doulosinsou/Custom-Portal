const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const fetchData = require('./mysql');
const bcrypt = require('bcryptjs');

router.use(myData);

router.get('/', function (req,res){
  req.me.backto = "";
  req.me.title = "Portal Home";
  req.me.js = "main.js";
  res.render('index', req.me);
});

router.get('/user', function (req,res){
  req.me.backto = "/portal/";
  req.me.title = "Account Settings";
  req.me.js = "account.js";
  req.me.validatejs = "validate.js"
  res.render('user', req.me);
});

router.post('/personal', function(req,res){
  fetchData.update(req.body, "ID", req.userId);
});

router.post('/passreset', async function(req,res){
  const find = await fetchData.find("ID", req.userId);
  console.log(req.body.oldPass)
  if (!bcrypt.compareSync(req.body.oldPass, find[0].pass)){
    console.log("bcrypt failed to match password");
    res.status(401).send({alert:"The old password is incorrect"});
  }else{
    const hashedPassword = bcrypt.hashSync(req.body.newPass, 8);
    fetchData.update({pass:hashedPassword}, "ID", req.userId);
    console.log("resetting password for user "+find[0].name)
    res.status(200).send({success: "successful password reset"})
  }
})




async function myData(req, res, next){
  //log recent activity
  const now = new Date().setHours(new Date().getHours() - 5);
  const newtime = new Date(now).toISOString().slice(0, 19).replace('T', ' ');
  const logTime = "UPDATE authentication SET lastactive='"+newtime+"' WHERE ID='"+req.userId+"'";
  // console.log(logTime);
  fetchData.allsql(logTime);

  //get info
  const call = await fetchData.find("ID", req.userId);
  req.me = call[0];
  req.me.phone = JSON.parse(call[0].phone);

  next();
}

async function testData(req,res,next){
  console.log(req.body)
  // next()
}

module.exports = router;
