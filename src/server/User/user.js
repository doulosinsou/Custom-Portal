const mysql = require('mysql');
const dotenv = require('dotenv').config();
const fetchData = require('../mysql');

const pool = mysql.createPool({
  connectionLimit : 5,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

async function createUser(submit){
  const existsQuery = "SELECT EXISTS( SELECT name from authentication WHERE name='"+submit.name+"')";
  const find = await fetchData(existsQuery);
  const exists = find[0][Object.keys(find[0])[0]];
  if (exists) return {nameExists:"Cannot use that Username"};
  // return find;

  const columns = ["name", "email", "pass"];
  const rows = ["'"+submit.name+"'", "'"+submit.email+"'", "'"+submit.password+"'"];
  const newRow = "INSERT INTO authentication ("+columns+") VALUES ("+rows+")";
  const newUser = await fetchData(newRow);
  return newUser;
}

exports.create = createUser;
