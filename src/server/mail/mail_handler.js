const nodemailer = require('nodemailer');
const fs = require('fs');
const dotenv = require('dotenv').config();
const path = require('path');



async function makeEmail(emailTo, emailSub, template, data){
  const transport = nodemailer.createTransport({
      host: "mail.moyeraudio.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: '"Reqk626rex,"'
      }
  });

  const options = {
      from: '"Moyer Audio Quote App" <'+process.env.EMAIL_USER+'>',
      to: emailTo,
      subject: emailSub,
      text: await parseText(template, "text"),
      html: await parseText(template, "html"),
      attachments: [
        {
          filename: 'ma_logo_simple.png',
          path: path.resolve(__dirname,'ma_logo_simple.png'),
          cid: 'ma_logo_simple.png'
        }
      ]
  };

  transport.sendMail(options, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent');
  });
}

function parseText(template, type){
  return new Promise((resolve, reject)=>{
    fs.readFile(path.resolve(__dirname,'mail.ma'), (err, result)=>{
      if (err){console.log(err); return}
      let stringed = result.toString();
      const typemail = findTag(stringed, template);
      const content = findTag(typemail, type)
      let fullEmail;
      if (type==="text") {
        fullEmail = content;
      }else if (type === "html") {
        const head = findTag(stringed, "header");
        const foot = findTag(stringed, "footer");
        fullEmail = head+content+foot;
      }
      resolve(fullEmail);
    })
  })
}

function findTag(data, tag){
  const reg = "<"+tag+">.*?[\\S\\s]*<\\/"+tag+">";
  const found = data.match(reg).join(/\n/);
  openL = tag.length + 2;
  closeL = tag.length + 3;
  const content = found.substring(openL, found.length - closeL);
  return content;
}

function overWrite(){



}

// makeEmail("luke@moyeraudio.com", "Test nodemailer", "notice");

module.exports = makeEmail;
