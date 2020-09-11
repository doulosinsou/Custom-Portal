const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const createUser = require('../User/user').create;
const fetchData = require('../mysql');


router.get('/me', async function (req,res,next){
  console.log('made get request to /portal/me');
  const query = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
  const me = await fetchData(query);
  me[0].pass = "";
  me[0].ID = "";
  res.send(me[0]);
  // console.log("const me response:")
  // console.log(me);

})


module.exports = router;
