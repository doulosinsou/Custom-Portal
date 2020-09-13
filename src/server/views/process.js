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

    let rendered = content.toString();
    const reg = /\{\$.*?\$\}/gm;
    const marks = rendered.match(new RegExp(reg));

    for (mark in marks){
      let tag = marks[mark];
      let raw = tag.substring(2,tag.length-2);
      rendered = rendered.replace(tag, data[raw]);
    }

    return callback(null, rendered);
  });
};

module.exports = process
