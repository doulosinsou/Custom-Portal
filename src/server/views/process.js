const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

function process(filePath, data, callback) {
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(err)
    console.log("data.name is: "+data.name);

    const rendered = content.toString();
    let replace = rendered;
    const reg = /\{\$.*?\$\}/gm;
    const marks = string.match(new RegExp(reg));
    console.log(marks);
    // console.log(Array.from(test, x=> x[1]));

    // const matched = rendered.matchAll(new RegExp('/#(.*?)#/'));
    // console.log(Array.from(matched, x => x[1]));

    // for (match in matched){
    //   console.log(matched[match]);
    // }

    // rendered
    //   .replace('#name#', data.name)
    //   .replace('#email#', data.email)
    // return callback(null, rendered);
  });
};



module.exports = process
