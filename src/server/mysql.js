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
        console.log(query);
        console.log(result);
        resolve(result);
      });
    });
  };

module.exports = allMysql;
