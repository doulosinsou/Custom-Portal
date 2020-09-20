const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const fetchData = require('./mysql');

router.use(myData);

router.get('/', function (req,res){
  req.me.backto = "";
  req.me.title = "Portal Home";
  res.render('index', req.me);
});

router.get('/user', function (req,res){
  req.me.backto = "/portal/";
  req.me.title = "Account Settings";
  res.render('user', req.me);
});

router.post('/personal', function(req,res){
  // console.log(req.body);
  let update = "UPDATE authentication SET ";
  for (item in req.body){
    update = update + item+"='"+req.body[item]+"' ";

    //PHONE DATA IS JSON OBJECT, NEEDS PARSED SEPARATELY
  }
  update = update.substring(0,update.length-2) + " WHERE ID='"+req.userId+"'";
  console.log(update);
  fetchData(update);
});





async function myData(req, res, next){
  //log recent activity
  const now = new Date().setHours(new Date().getHours() - 5);
  const newtime = new Date(now).toISOString().slice(0, 19).replace('T', ' ');
  const logTime = "UPDATE authentication SET lastactive='"+newtime+"' WHERE ID='"+req.userId+"'";
  console.log(logTime);
  fetchData(logTime);

  //get info
  const query = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
  const call = await fetchData(query);
  req.me = call[0];
  req.me.phone = JSON.parse(call[0].phone);

  next();
}

module.exports = router;
