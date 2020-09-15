const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

const authController = require('./Auth_controller');
const verifyToken = require('./Verify_Token');
const user = require('./user.js');

const port = "3071";
const server = app.listen(port, ()=>{
  console.log("server started on "+port);
});

app.use(express.static("./src/client"));
app.use(express.static("./src/portal2"));

app.use('/', express.static("./src/client"));
app.use('/portal', verifyToken, isValid, user, express.static('./src/portal2'));

const maViews = require('./views/process');
app.engine('ma', maViews);
app.set('views', path.resolve(__dirname+'/views/templates'));
app.set('view engine', 'ma');

async function isValid(req, res, next){
  if (req.err){
    console.log(req.err);
    res.redirect(301, "/");
  }else{
    next();
  }
}

app.post('/register', authController.register, function (req,res,next){
  console.log(req.data);
  res.redirect(301, '/');
})

app.post('/login', authController.login)

app.all('/port', verifyToken, function(req,res,next){
  if (req.err){
    console.log(req.err);
    res.send(req.err);
  }else{
    res.send({redirect: "/portal"});
  }
})
