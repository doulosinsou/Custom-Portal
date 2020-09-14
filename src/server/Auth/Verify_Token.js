var jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function verifyToken(req,res,next){
  let token;
    if(!req.headers.cookie){token = ""}else{
      token = req.headers.cookie.match(new RegExp('(^|)' + 'login' + '=([^;]+)'));
      if(!token){
        req.err = {auth: false, message: 'No token provided.'};
        next();
      }else{
        token = token[2];
      }}

  jwt.verify(token, process.env.SECRET, async function(err, decoded) {
    if (err) {
      req.err = {auth: false, message: 'Failed to authenticate token.'};
    }else{
      console.log("Token verified. Setting token id to req");
      req.userId = decoded.id
    }
  next()
  })
}

module.exports = verifyToken;
