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

const port = "3101";
const server = app.listen(port, ()=>{
  console.log("server started on "+port);
});

app.use(express.static("./src/client"));

app.use(verifyToken, isValid);
app.use('/', express.static("./src/client"));
app.use('/portal', user);

const maViews = require('./views/process');
app.engine('ma', maViews);
app.set('views', path.resolve(__dirname+'/views/templates'));
app.set('view engine', 'ma');

async function isValid(req, res, next){
  if (req.err){
    console.log(req.err);
    if(req.originalUrl.match(RegExp(/\/portal/))){
      res.redirect(301, "/");
    }else if (req.originalUrl === "/login" || req.originalUrl === "/register"){
      next();
    }
  }else{
    next();
  }
}

app.post('/register', authController.register, function (req,res,next){
  console.log(req.data);
  res.status(301).send({redirect: "/"});
})

app.post('/login', authController.login)
app.get('/port', function(req, res){
  console.log("/port called")
  if (req.err){
    res.send({warning: "not logged in"});
    res.end();
  }else{
    res.status(200).send({render:"/portal/"});
  }
})
