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
app.use(express.static("./src/portal2"));


const port = "3011";
const server = app.listen(port, ()=>{
  console.log("server started on "+port);
});


app.use('/', express.static("./src/client"));
app.use('/portal', express.static('./src/portal2'));

// app.use('/user', authController);

function middleware(req, res, next){
  console.log("/portal afterware called");
  next();
}
// app.use('/portal', function(req, res){
  // res.redirect('./src/portal2');
// })

// app.use('/portal', function(req,res,next){
//   // console.log("verifyToken has completed");
//   if (req.err){
//     console.log(req.err);
//     res.redirect("/");
//     }
//   else{
//     res.redirect("/portTry2");
//   }
// });

  // res.redirect('/portal2');

app.post('/register', authController.register, function (req,res,next){
  console.log(req.data);
  res.redirect('/client');
})

app.post('/login', authController.login)

// app.all('/portal/*', begin);

// function begin(req,res,next){
//   console.log("verifyToken about to be called");
//   verifyToken(req,res,next);
//   if (req.err){
//     console.log(req.err);
//     res.send(req.err);
//   }else{
//     next();
//   }
// }

// app.use('/portal', function(req,res){
//   express.static("./src/portal2")
//   // res.redirect('./src/portal2');
// })

app.all('/port', verifyToken, function(req,res,next){
  if (req.err){
    console.log(req.err);
    res.send(req.err);
  }else{
    console.log("/portal called");
    // res.redirect('/portal2');
    res.send({redirect: "/portal"});
  }
})

app.get('/port/me', async function(req,res,next){
  const call = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
  const data = await query(call);
  data[0].pass = "";
  data[0].ID = "";
  res.send(data[0])
})
