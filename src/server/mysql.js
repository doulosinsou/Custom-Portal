const mysql = require('mysql');
const dotenv = require('dotenv').config();

const con = mysql.createPool({
  connectionLimit : 5,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const testData = async function(auth){
  return new Promise(function(resolve, reject){
      const query = "SELECT * FROM authentication WHERE name ='"+auth+"'";
      con.query(query, function(err, result){
        if (err) throw err;
        resolve(result[0]);
      });
    });
  };



module.exports = testData;
