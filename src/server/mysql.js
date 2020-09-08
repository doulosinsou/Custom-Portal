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
        // console.log("mysql.js allMysal function result below: ");
        // console.log(result);
        resolve(result);
      });
    });
  };

//
// const findData = async function(cells, condition, value, table){
//   return new Promise(function(resolve, reject){
//     if (cells === "all" || "All") cells = "*";
//     if (!table) table = "authentication";
//       const query = "SELECT "+cells+" FROM "+table+" WHERE "+condition+" ='"+value+"'";
//       pool.query(query, function(err, result){
//         if (err) throw err;
//         // if (!result[0]) resolve(err);
//         if (result[0][condition]) resolve(false);
//         resolve(result);
//       });
//     });
//   };
//
//
//
// const createRow = async function(columns, rows, table){
//     return new Promise(function(resolve, reject){
//       if (!table) table = "authentication";
//         const create = "INSERT INTO "+table+" ("+columns+") VALUES ("+rows+")";
//         pool.query(create, async function(err, result){
//           if (err) throw err;
//           const find = await findData("all", "name", rows[0]);
//           resolve(find);
//         });
//       });
//     };

module.exports = allMysql;
// exports.findData = findData;
// exports.createRow = createRow
