const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const fetchData = require('./mysql');

//Admin page for listing all users
router.get('/userList', function (req,res){
  req.me.backto = "/portal/";
  req.me.title = "User List";
  req.me.js = "manage_users.js";
  res.render('userList', req.me);
});

//Admin page for listing all notices
router.get('/noticeBoard', function (req,res){
  req.me.backto = "/portal/";
  req.me.title = "Notice Board";
  req.me.js = "manage_notices.js";
  res.render('noticeBoard', req.me);
});

//admin page to see user details
router.get('/user/:username', async function (req,res){
  const findData = {
    condition: "username",
    value: req.params.username,
    table: "users"
  }
  const call = await fetchData.find(findData);
  req.me.user = call[0];
  req.me.backto = "/portal/admin/userList/";
  req.me.title = "User Info";
  req.me.js = "manage_users.js";
  res.render('user', req.me);
});

//admin browser builds userlist table
router.get('/userList/allUsers', async function(req,res){
  console.log("request to allUsers")
  const cols = [
    "username",
    "name",
    "role",
    "job",
    "active"
  ]
  const all = await fetchData.only({columns:cols, table:"users"});
  res.send(all);
})

router.post('/notice', function(req,res){

  if(req.body.delete){
    const del = "DELETE from notice_board WHERE id='"+req.body.id+"'";
    fetchData.allsql(del);
  }else{
    const updateData = {
      change: req.body,
      condition: "id",
      value: req.body.id,
      table: "notice_board"
    }
    fetchData.update(updateData);
  }
  res.send("updated");
})

//admin update user table
router.post('/update', async function(req,res){
    const username = req.query.username;

    if(req.body.delete && (username != req.me.username)){
      const del = "DELETE from users WHERE username='"+username+"'";
      fetchData.allsql(del);

    }else if (!req.body.delete){
      const updateData = {
        change: req.body,
        condition: "username",
        value: username,
        table: "users"
      }
      fetchData.update(updateData)
    }

})


module.exports = router
