const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

async function process(filePath, data, callback) {
  // let header, footer;
  // fs.readFile(__dirname+'/templates/header.ma', function (err, head){header =  head.toString()});
  // fs.readFile(__dirname+'/templates/footer.ma', function (err, foot){footer = foot.toString()});

  let header = await new Promise((resolve, reject) => {
    fs.readFile(__dirname+'/templates/header.ma', function (err, head){
      resolve(head);
    })});
  let footer = await new Promise((resolve, reject) => {
    fs.readFile(__dirname+'/templates/footer.ma', function (err, foot){
      resolve(foot)
    })});

  fs.readFile(filePath, function (err, content) {
    if (err) return callback(err)

    let rendered = header.toString()+content.toString()+footer.toString();
    // let rendered = content.toString();
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
