const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const createUser = require('../User/user').create;
const fetchData = require('../mysql')
const dotenv = require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

router.post('/register', async function(req, res) {

  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const created = await createUser(
    {
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  })

  if (!created) return res.status(500).send("There was a problem registering the user.");

  if (created.nameExists) {
    res.send(created);
  }

  console.log(created);

  });

router.post('/login', async function(req, res) {
  const query = "SELECT * FROM authentication WHERE name='"+req.body.name+"'";
  const find = await fetchData(query);

  if (find.err) return res.status(500).send('Error on the server.');

  console.log("bcrypt returns: "+bcrypt.compareSync(req.body.password, find[0].pass));

  const validPass = bcrypt.compareSync(req.body.password, find[0].pass);
  if (!validPass)
  {
    console.log("bcrypt failed to match password");
    return res.status(401).send({ auth: false, token: null });
  }else{
  const token = jwt.sign({id: find[0].ID}, process.env.SECRET, {
    expiresIn: 86400 // expires in 24 hours
  });
  res.status(200).send({ auth: true, token: token });
  }
  });

router.get('/portal', function(req,res,next){
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, process.env.SECRET, async function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    const query = "SELECT ID, name FROM authentication WHERE ID='"+decoded.id+"'";
    const user = await fetchData(query);
    if (user.err) {
      return res.status(500).send("There was a problem finding the user.");
    }else{
      console.log(user[0].name+" is now logged in");
      res.status(200).send(user[0]);
  }
  })
})


function verifyToken(req, res, next){
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();

})
}

module.exports = router;
