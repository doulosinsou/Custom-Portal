const nodemailer = require('nodemailer');
const fs = require('fs');
const dotenv = require('dotenv').config();
const path = require('path');

async function makeEmail(data){
  const transport = nodemailer.createTransport({
      host: "mail.moyeraudio.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
  });

  const parsed = await parseText();
  const options = {
      from: '"Moyer Audio Quote App" <'+process.env.EMAIL_USER+'>',
      to: data.to,
      subject: data.subject,
      text: parsed.text,
      html: parsed.html,
      attachments: [
        {
          filename: 'ma_logo_simple.png',
          path: path.resolve(__dirname,'ma_logo_simple.png'),
          cid: 'ma_logo_simple.png'
        }
      ]
  };

  transport.sendMail(options, (error, info) => {
          if (error) return console.log(error)
          console.log('Message sent');
  });

  function parseText(){
    return new Promise((resolve, reject)=>{
      fs.readFile(path.resolve(__dirname,'mail.ma'), (err, result)=>{
        if (err){console.log(err); return}
        let stringed = result.toString();
        const head = findTag(stringed, "header");
        const foot = findTag(stringed, "footer");
        let content = findTag(stringed, data.template);

        content = overWrite(content);

        const text = findTag(content, "text");
        const html = findTag(content, "html");
        const fullhtml = head+html+foot;

        resolve({text:text, html:fullhtml});
      })
    })
  }

  function findTag(string, tag){
    const reg = "<"+tag+">.*?[\\S\\s]*<\\/"+tag+">";
    const found = string.match(reg).join(/\n/);
    openL = tag.length + 2;
    closeL = tag.length + 3;
    const content = found.substring(openL, found.length - closeL);
    return content;
  }

  function overWrite(string){
    const marks = string.match(new RegExp(/\{\$.*?\$\}/gm));

    for (mark in marks){
      let tag = marks[mark];
      let raw= tag.substring(2, tag.length-2);
      string = string.replace(tag, data.match[raw]);
    }
    return string;
  }
}

module.exports = makeEmail;
