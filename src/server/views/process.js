const fs = require('fs');


async function process(filePath, data, callback) {
    const header = __dirname+'/templates/header.ma';
    const footer = __dirname+'/templates/footer.ma';
    const main = filePath;
    let rendered = await mashFiles([header, main, footer]);

    if (data.role !== "admin"){
      rendered = wipeAdmin(rendered);
    }

    //______________________________________

      // const tstr = "sample.first.second.third";
      // const tdat = {
      //   sample: {
      //     first:{
      //       second:{
      //         third: "here I am"
      //       }
      //     }
      //   }
      // };
      // const nstr = tstr.split(".");
      // let stuff = tdat;
      // for (parameter in nstr){
      //   stuff = stuff[nstr[parameter]];
      // }
      // console.log(stuff);

    //______________________________________


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

    function overWrite(input){
      let textstring = input
      const marks = textstring.match(new RegExp(/\{\$.*?\$\}/gm));
      for (mark in marks){
        let tag = marks[mark];
        let raw= tag.substring(2, tag.length-2);

        const split = raw.split(".");

        let stuff = data;
        for (subitem in split){
          stuff = stuff[split[subitem]];
        }
        // console.log(stuff);
        textstring = textstring.replace(tag, stuff);
        
        // this works!!!!
        // if (split[1]){
        //   textstring = textstring.replace(tag, data[split[0]][split[1]]);
        // }else{
        //   textstring = textstring.replace(tag, data[split[0]]);
        // }
        // ^^^^^^^^^^^^^^^^^^^^^^^^^


        // let datacycle
        // for (subitem in split){
        //   datacyle = datacycle + data[split[subitem]];
          // textstring = textstring.replace(tag, data[split]);

        // }


        //   if (subitem !== 0){
        //     textstring = textstring.replace(tag, data[split][subitem]);
        //     console.log("data[split][subitem] is: "+data[split][subitem]);
        //   }
        //
        //   // console.log(split);
        // }
        //
        // // textstring = textstring.replace(tag, datacycle);
        // // if (data[raw] == undefined){
        //   // console.log(tag+" does not exist in req data")
        //   // textstring= textstring.replace(tag,"");
        // }else{
        //   // textstring = textstring.replace(tag, data[raw]);
        //   // textstring = textstring.replace(tag, datacycle);
        // }
      }
      console.log("data['phone']['base'] is: "+data['phone']['base'])
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
