const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const fetchData = require('../mysql');
// const maViews = require('../views/process');


let query;

router.get('/', async function (req,res,next){
  query = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
  const call = await fetchData(query);
  const me = call[0];
  me.backto = "";
  me.title = "Portal Home";
  res.render('index', me);
});

router.get('/user', async function (req,res,next){
  query = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
  const call = await fetchData(query);
  const me = call[0];
  me.backto = "/portal/";
  me.title = "Account Settings";
  res.render('user', me);
});

module.exports = router;
