const mysql = require('mysql');

const con = mysql.createConnection({
  host: "moyeraudio.com",
  user: "moyeraud_calcAdmin",
  password: "MAcalculator",
  database: "moyeraud_calculator"
});

const testData = async function(auth){
  return new Promise(function(resolve, reject){
    con.connect((err) => {
      if(err) throw err;
      console.log("mysql.js connected to mysql");
      const query = "SELECT * FROM authentication WHERE name ='"+auth+"'";
      con.query(query, function(err, result){
        if (err) throw err;
        resolve(result[0]);
      });
    })
  });
};

module.exports = testData;
