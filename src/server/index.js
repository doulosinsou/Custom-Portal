const express = require('express');
const app = express();
const path = require('path');
const query = require('./mysql.js');

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('./src/client'));

const port = "3011";
const server = app.listen(port, ()=>{
  console.log("server started on "+port);
});

const filename = path.join('./src/client')

app.post('/calc', authenticate);

async function authenticate(req,res){
  const ask = await query(req.body.name);
  if (ask.pass === req.body.pass){
    console.log("pass matched");
    res.send(ask.token);
  }else{
    console.log("pass did not match");
  }
}
