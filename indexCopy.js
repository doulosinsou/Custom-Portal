const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(express.static('./src/client'));

const port = "3011";
const server = app.listen(port, ()=>{
  console.log("server started on "+port);
});
