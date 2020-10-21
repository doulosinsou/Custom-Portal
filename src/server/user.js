const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const fetchData = require('./mysql');
const bcrypt = require('bcryptjs');

const adminRouter = require('./admin')

router.use(myData);
router.use('/admin', admin, adminRouter)

//portal home page
router.get('/', function (req,res){
  req.me.backto = "";
  req.me.title = "Portal Home";
  req.me.js = "main.js";
  res.render('index', req.me);
});

//user's personal information
router.get('/me', function (req,res){
  req.me.backto = "/portal/";
  req.me.title = "Account Settings";
  req.me.js = "account.js";
  req.me.validatejs = "validate.js"
  res.render('me', req.me);
});

//global notice board. (filter by role/job)
router.get('/notice', async function(req,res){
  let findData = {table:'notice_board'};
  let find
  if (req.me.role !== "admin" && req.me.role !== "owner"){
    const search = {
      search: [req.me.role,req.me.job],
      condition: "target",
      table: "notice_board"
    }
    find = await fetchData.search(search);

  }else{
    find = await fetchData.find(findData);
  }
  const find_updated = await activeNotice(find);
  const notice = {
    role:req.me.role,
    data:find_updated,
  }
  res.send(notice);
})

//user changes personal information
router.post('/personal', function(req,res){
  const updateData = {
    change: req.body,
    condition: "ID",
    value: req.userId,
    table: "users"
  }
  fetchData.update(updateData);
});

//user resets password from panel
router.post('/passreset', async function(req,res){
  const findData = {
    condition: "ID",
    value: req.userId,
    table: "users"
  }
  const find = await fetchData.find(findData);
  if (!bcrypt.compareSync(req.body.oldPass, find[0].pass)){
    console.log("bcrypt failed to match password");
    res.status(401).send({alert:"The old password is incorrect"});
  }else{
    const hashedPassword = bcrypt.hashSync(req.body.newPass, 8);
    const updateData = {
      change: {pass:hashedPassword},
      condition: "ID",
      value: req.userId,
      table: "users"
    }
    fetchData.update(updateData);
    console.log("resetting password for user "+find[0].name)
    res.status(200).send({success: "successful password reset"})
  }
});

//put user's own information into req
async function myData(req, res, next){
  //log recent activity
  const now = new Date().setHours(new Date().getHours() - 5);
  const newtime = new Date(now).toISOString().slice(0, 19).replace('T', ' ');
  const updateData = {
    change: {lastactive:newtime},
    condition: "ID",
    value: req.userId,
    table: "users"
  }
  fetchData.update(updateData);

  //get personal info
  const findData = {
    condition: "ID",
    value: req.userId,
    table: "users"
  }
  const call = await fetchData.find(findData);
  req.me = call[0];

  next();
}

//middleware to check if role is admin
function admin(req,res,next){
  if (req.me.role === "admin" || req.me.role === "owner"){
    next()
  }else {
    res.redirect(301, "/");
  }
}

//helper to update Notices with active Status
function activeNotice(data){
  const today = new Date();
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const weekday = today.getDay();
  const thisDay = days[weekday];

  for (i in data){
    if (today>data[i].start && today<data[i].end && data[i].pattern.match(thisDay)){
      console.log(data[i].notice+" is active today");
      data[i]["live"] = true;
    }else{
      data[i]["live"] = false;
    }
  }

  return data

}



module.exports = router;
