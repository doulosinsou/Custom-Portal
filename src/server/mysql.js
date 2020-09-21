const mysql = require('mysql');
const dotenv = require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit : 5,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const allMysql = async function (query){
  return new Promise(function(resolve, reject){
      pool.query(query, function(err, result){
        if (err) resolve({err:err})
        // console.log(query);
        // console.log(result);
        resolve(result);
      });
    });
  };

const findsomething = async function (cond, val){
  return new Promise(function(resolve, reject){
      pool.query("SELECT * FROM authentication WHERE "+cond+"=? ", [val], function(err, result){
        if (err) console.log(err);
        // console.log(query);
        // console.log(result);
        resolve(result);
      });
    });
  };

const updatesomething = async function (change, cond, val){
  return new Promise(async function(resolve, reject){

// const isJson = (str)=>{
//   try{JSON.parse(str)}
//   catch(err){return false}
//   return true
// }

    let upstr = ""
    for (key in change){
      const curr = change[key]
      let val
      const str = JSON.stringify(curr);
        if (str.match(/\{.*?\}/g)){
          val = str
        }else{
          val = curr
        }
      upstr= upstr+key+"='"+val+"', ";

      }
      upstr= upstr.substring(0,upstr.length-2);
      console.log(upstr)

      pool.query("UPDATE authentication SET "+upstr+" WHERE "+cond+"=? ", [val], function(err, result){
        if (err) console.log(err);
        // console.log(query);
        console.log();
        resolve(result);
      });
    });
  };

exports.allsql = allMysql;
exports.find = findsomething;
exports.update = updatesomething;
