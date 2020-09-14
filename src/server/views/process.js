const fs = require('fs');

async function process(filePath, data, callback) {
    const header = __dirname+'/templates/header.ma';
    const footer = __dirname+'/templates/footer.ma';
    const main = filePath;
    let rendered = await mashFiles([header, main, footer]);
    const reg = /\{\$.*?\$\}/gm;
    const marks = rendered.match(new RegExp(reg));

    for (mark in marks){
      let tag = marks[mark];
      let raw = tag.substring(2,tag.length-2);
      rendered = rendered.replace(tag, data[raw]);
    }
    return callback(null, rendered);
};

async function mashFiles(files){
  let filesArray='';
  const readIt = await function(x){
    return new Promise((resolve, reject)=>{
      fs.readFile(x, function(err,html){
      resolve(html.toString());
  })})};
  for (i=0;i<files.length; i++){filesArray += await readIt(files[i]);}
  return filesArray;
}

module.exports = process
