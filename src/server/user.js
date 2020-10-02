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

router.get('/me', function (req,res){
  req.me.backto = "/portal/";
  req.me.title = "Account Settings";
  req.me.js = "account.js";
  req.me.validatejs = "validate.js"
  res.render('me', req.me);
});

router.get('/userList', admin, function (req,res){
  req.me.backto = "/portal/";
  req.me.title = "User List";
  req.me.js = "manage_users.js";
  res.render('userList', req.me);
});

router.get('/user/:username', admin, async function (req,res){
  const call = await fetchData.find("username", req.params.username);
  req.me.user = call[0];
  req.me.backto = "/portal/userList/";
  req.me.title = "User Info";
  req.me.js = "manage_users.js";
  res.render('user', req.me);
});

router.get('/userList/allUsers', admin, async function(req,res){
  console.log("request to allUsers")
  const cols = [
    "username",
    "name",
    "role",
    "active"
  ]
  const all = await fetchData.only(cols);
  res.send(all);

})

router.post('/personal', function(req,res){
  fetchData.update(req.body, "ID", req.userId);
});

router.post('/passreset', async function(req,res){
  const find = await fetchData.find("ID", req.userId);
  if (!bcrypt.compareSync(req.body.oldPass, find[0].pass)){
    console.log("bcrypt failed to match password");
    res.status(401).send({alert:"The old password is incorrect"});
  }else{
    const hashedPassword = bcrypt.hashSync(req.body.newPass, 8);
    fetchData.update({pass:hashedPassword}, "ID", req.userId);
    console.log("resetting password for user "+find[0].name)
    res.status(200).send({success: "successful password reset"})
  }
});




async function myData(req, res, next){
  //log recent activity
  const now = new Date().setHours(new Date().getHours() - 5);
  const newtime = new Date(now).toISOString().slice(0, 19).replace('T', ' ');
  const logTime = "UPDATE authentication SET lastactive='"+newtime+"' WHERE ID='"+req.userId+"'";
  fetchData.allsql(logTime);

  //get info
  const call = await fetchData.find("ID", req.userId);
  req.me = call[0];
  // req.me.phone = JSON.parse(call[0].phone);

  next();
}

function admin(req,res,next){
  if (req.me.role === "admin"){
    // const all = await fetchData.find();
    // req.users = all
  next()
  }else {
  return false;
  }
}

module.exports = router;
