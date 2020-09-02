const mysql = require('mysql');

const con = mysql.createConnection({
  host: "moyeraudio.com",
  user: "moyeraud_calcAdmin",
  password: "MAcalculator",
  database: "moyeraud_calculator"
});

async function testData(auth){
  const promiseDat = new Promise(function(resolve, reject){
    con.connect(async (err) => {
      if(err)
      throw err;
      console.log("connected to mysql");
      const data = con.query(
          "SELECT * FROM authentication WHERE name ='"+auth+"'",
          function(err, result){
            if (err)
            throw err
            resolve(result[0]);
      });
    })
  });
  return promiseDat;
};

module.exports = testData;
