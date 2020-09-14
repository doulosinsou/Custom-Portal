const express = require('express');
const app = express();
const path = require('path');

const authController = require('./Auth/Auth_controller');
const verifyToken = require('./Auth/Verify_Token');
const user = require('./User/user.js');


const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());


const port = "3041";
const server = app.listen(port, ()=>{
  console.log("server started on "+port);
});

app.use(express.static("./src/client"));
app.use(express.static("./src/portal2"));


app.use('/client', express.static("./src/client"));
app.use('/portal', verifyToken, isValid, user, express.static('./src/portal2'));

const maViews = require('./views/process');
app.engine('ma', maViews);
app.set('views', path.resolve(__dirname+'/views/templates'));
app.set('view engine', 'ma');

async function isValid(req, res, next){
  if (req.err){
    console.log(req.err);
    return res.redirect(301, "/client");
  }else{
    next();
  }
}

app.post('/register', authController.register, function (req,res,next){
  console.log(req.data);
  res.redirect(301, '/client');
})

app.post('/login', authController.login)

app.all('/port', verifyToken, function(req,res,next){
  if (req.err){
    console.log(req.err);
    res.send(req.err);
  }else{
    console.log("send /portal redirect path");
    res.send({redirect: "/portal"});
  }
})

// app.use("/data", )

// app.get('/port/me', async function(req,res,next){
//   const call = "SELECT * FROM authentication WHERE ID='"+req.userId+"'";
//   const data = await query(call);
//   data[0].pass = "";
//   data[0].ID = "";
//   res.send(data[0])
// })
