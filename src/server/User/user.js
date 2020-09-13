const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const fetchData = require('../mysql');
const maViews = require('../views/process');

// app.engine('ma', maViews);
// app.set('views', '../views/templates'); // specify the views directory
// app.set('view engine', 'ma'); // register the template engine

let query;

router.get('/', async function (req,res,next){
  query = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
  const call = await fetchData(query);
  const me = call[0];
  me.pass = "";
  me.ID = "";
  res.render('index', me);


  // res.send(me[0]);
  // console.log("const me response:")
  // console.log(me);

})


module.exports = router;
