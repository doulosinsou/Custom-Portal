const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const fetchData = require('./mysql');

let query;

router.get('/', myData, function (req,res){
  req.me.backto = "";
  req.me.title = "Portal Home";
  res.render('index', req.me);
});

router.get('/user', myData, function (req,res){
  req.me.backto = "/portal/";
  req.me.title = "Account Settings";
  res.render('user', req.me);
});

async function myData(req, res, next){
  query = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
  const call = await fetchData(query);
  req.me = call[0];
  next();
}

module.exports = router;
