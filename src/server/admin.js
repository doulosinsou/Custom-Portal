const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const fetchData = require('./mysql');

//Admin page for listing all users
router.get('/userList', admin, function (req,res){
  req.me.backto = "/portal/";
  req.me.title = "User List";
  req.me.js = "manage_users.js";
  res.render('userList', req.me);
});

//admin page to see user details
router.get('/user/:username', admin, async function (req,res){
  const call = await fetchData.find("username", req.params.username);
  req.me.user = call[0];
  req.me.backto = "/portal/userList/";
  req.me.title = "User Info";
  req.me.js = "manage_users.js";
  res.render('user', req.me);
});

//admin browser builds userlist table
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

//admin update user table
router.post('/update/', async function(req,res){
    const username = req.body.username;
    delete req.body.username;

    if(req.body.delete && (username != req.me.username)){
      const del = "DELETE from authentication WHERE username='"+username+"'";
      fetchData.allsql(del);
    }else{
      fetchData.update(req.body, "username", username)
    }

})
