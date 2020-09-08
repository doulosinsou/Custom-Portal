var jwt = require('jsonwebtoken');
var config = require('../config');
const dotenv = require('dotenv').config();

function verifyToken(req,res,next){
  console.log("verifyToken called");
  const token = req.headers['x-access-token'];
  if (!token) req.err = {auth: false, message: 'No token provided.'};

  jwt.verify(token, process.env.SECRET, async function(err, decoded) {
    if (err) req.err = {auth: false, message: 'Failed to authenticate token.'};

  console.log("Token verified. Setting token id to req");
  req.userId = decoded.id
  next()
  })
}

module.exports = verifyToken;
