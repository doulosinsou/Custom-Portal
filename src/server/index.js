const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

const login = require('./login');
const verifyToken = require('./Verify_Token');
const user = require('./user.js');
const registration = require('./register')

const port = "3101";
const server = app.listen(port, ()=>{
  console.log("server started on "+port);
});

app.use(express.static("./src/client"));

app.use(verifyToken, isValid);
app.use('/', express.static("./src/client"));
app.use('/portal', user);
app.use('/register', registration);

const maViews = require('./views/process');
app.engine('ma', maViews);
app.set('views', path.resolve(__dirname+'/views/templates'));
app.set('view engine', 'ma');

async function isValid(req, res, next){
  if (req.err){
    console.log(req.err);
    console.log(req.originalUrl);
    if(req.originalUrl.match(RegExp(/\/portal/))){
      res.redirect(301, "/");
    }else if (req.originalUrl === "/activated"){
      res.sendFile(path.resolve("src/client/index.html"));
    }else if (req.originalUrl === "/login" || req.originalUrl.match(RegExp(/\/register/))){
      next();
    }
  }else{
    next();
  }
}

app.post('/login', login)
app.get('/port', function(req, res){
  console.log("/port called")
  if (req.err){
    res.send({warning: "not logged in"});
    res.end();
  }else{
    res.status(200).send({render:"/portal/"});
  }
})


const mailer = require('./mail/mail_handler')
app.get('/mail', domail);

function domail(){
  const options = {
    to: "luke@moyeraudio.com",
    subject: "Test nodemailer",
    template: "notice",
    match: {
      company: "Moyer Audio",
      sendout: "Good evening. This message is to test if the replacement strategy functions in my custom email templates. Please accept this test as evidence that something worked.",
      signed: "Regards, Luke, M"
    }

  }
  mailer(options);
}
