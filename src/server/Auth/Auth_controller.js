var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var createUser = require('../User/user').create;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.post('/register', async function(req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const created = await createUser(
    {
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  })

  if (!created) return res.status(500).send("There was a problem registering the user.");

  console.log(created);
  if (created.nameExists) console.log("nameExists is true");
  if (!created.nameExists) console.log("nameExists is false");
  if (created.nameExists) {
    res.send(created);
    // return
  }
  console.log("created const is: ")
  console.log(created);

    // create a token
    // const token = jwt.sign({ id: user.id }, config.secret, {
    //   expiresIn: 86400
    //   // expires in 24 hours
    // });
    // res.status(200).send({ auth: true, token: token });
  });


module.exports = router;
