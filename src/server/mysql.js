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

const findsomething = async function (search){
  const cond = search.condition;
  const val = search.value;
  const table = search.table;

  return new Promise(function(resolve, reject){
      if (!cond && !val){
        pool.query("SELECT * FROM "+table, function(err, result){
          if (err) console.log(err);
          const parsed = jsonparse(result)
          resolve(parsed);
        })
      }else{
        pool.query("SELECT * FROM "+table+" WHERE "+cond+"=? ", [val], function(err, result){
          if (err) console.log(err);
          const parsed2 = jsonparse(result)
          resolve(parsed2);
        });
      }
    });
  };

const findonly = async function (search){
  const cols = search.columns;
  const table = search.table;

  return new Promise(function(resolve, reject){
    let columns = ""
      for (i in cols){
        columns = columns+cols[i]+", ";
      }
      columns = columns.substring(0, columns.length-2);

      pool.query("SELECT "+columns+" FROM "+table, function(err, result){
          if (err) console.log(err);
          const parsed = jsonparse(result)
          resolve(parsed);
        });
    });
  };

const updatesomething = async function (search){
  const change = search.change;
  const cond = search.condition;
  const val = search.value;
  const table = search.table;

  return new Promise(async function(resolve, reject){

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

      pool.query("UPDATE "+table+" SET "+upstr+" WHERE "+cond+"=? ", [val], function(err, result){
        if (err) console.log(err);
        // console.log(query);
        console.log();
        resolve(result);
      });
    });
  };

const insert = (submit)=>{
  const table = submit.table;
  const data = submit.data;
  let columns =[];
  let rows = [];
  for (i in data){
    columns.push(i);
    rows.push("'"+data[i]+"'");
  }

  const newRow = "INSERT INTO "+table+" ("+columns+") VALUES ("+rows+")";
  allMysql(newRow);
}


//helper to identify and parse JSON columns
function jsonparse(data){
  for (i in data){
    for (n in data[i]){
      if (RegExp(/\{.*?\}/).test(data[i][n])){
        data[i][n] = JSON.parse(data[i][n]);
      }
    }
  }
  return data;
}

exports.allsql = allMysql;
exports.find = findsomething;
exports.update = updatesomething;
exports.only = findonly;
exports.insert = insert;
