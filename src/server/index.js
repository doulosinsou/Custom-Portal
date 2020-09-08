const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const query = require('./mysql.js');
const authController = require('./Auth/Auth_controller');
const verifyToken = require('./Auth/Verify_Token');

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static("./src/client"));
app.use(express.static("./src/portal2"))
// app.use('/user', authController);

const port = "3011";
const server = app.listen(port, ()=>{
  console.log("server started on "+port);
});

app.post('/register', authController.register, function (req,res,next){
  console.log(req.data);
  res.sendFile(path.resolve("./src/client/index.html"));
})

app.post('/login', authController.login)

// app.all('/portal/*', begin);

async function begin(req,res,next){
  console.log("verifyToken about to be called");
  verifyToken(req,res,next);
  if (req.err){
    console.log(req.err);
    res.sendFile(path.resolve("./src/client/index.html"));
  };
  next();
}

// app.get('/portal/home', begin, function(req,res,next){
//   console.log("About to redirect to portal/me.html");
//   // res.redirect(path.resolve("./src/portal/me.html"));
//   res.redirect("../src/portal/me.html");
// })

app.use('/portal', function(req,res){
  res.redirect('/portal');
})

// app.get('/po', function(req,res){
//   console.log("About to redirect to register.html");
//   // app.use(express.static('./src/portal'));
//   res.redirect('/portal');
//   // res.redirect('./portal/index.html');
//   // res.redirect(path.resolve("./src/portal/me.html"));
//   // res.redirect("/portal/me.html");
//   // console.log(__dirname);
// })



app.get('/port/me', begin, async function(req,res,next){
  const call = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
  const data = await query(call);
  data[0].pass = "";
  data[0].ID = "";
  res.send(data[0])
})
