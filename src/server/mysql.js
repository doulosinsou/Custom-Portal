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
      if(err){
        throw err;
      }else{
        console.log("connected to mysql");
        const data = new Promise(function(resolve, reject){
          con.query(
            "SELECT * FROM authentication WHERE name ='"+auth+"'", function(err, result){
              if (err){
                throw err;
              }else{
                resolve(result[0]);
              }});
            });
        resolve(data);
      }
    })
  });
  return promiseDat;
};

module.exports = testData;
