const fs = require('fs');

async function process(filePath, data, callback) {
    const header = __dirname+'/templates/header.ma';
    const footer = __dirname+'/templates/footer.ma';
    const main = filePath;
    let rendered = await mashFiles([header, main, footer]);

    if (data.role !== "admin"){
      rendered = wipeAdmin(rendered);
    }

    // const reg = /\{\$.*?\$\}/gm;
    // const marks = rendered.match(new RegExp(reg));
    //
    // for (mark in marks){
    //   let tag = marks[mark];
    //   let raw = tag.substring(2,tag.length-2);
    //   rendered = rendered.replace(tag, data[raw]);
    // }

    const replaced = overWrite(rendered);

    function wipeAdmin(string){
      const reg = "<admin>.*?[\\S\\s]*<\\/admin>";
      const match = string.match(reg).join(/\n/);
      const wiped = string.replace(match, "");
      return wiped;
    }

    function overWrite(textstring){
      const marks = textstring.match(new RegExp(/\{\$.*?\$\}/gm));
      for (mark in marks){
        let tag = marks[mark];
        let raw= tag.substring(2, tag.length-2);
        textstring = textstring.replace(tag, data[raw]);
      }
      return textstring;
    }

    return callback(null, replaced);
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
