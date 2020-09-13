
document.getElementById('find').addEventListener("click", function(){

const replace = {
  string: "sentence",
  itterations: "tags",
  value: "words",
  queries: "marks"
}

const string = document.getElementById('string');
let newstring = string.innerText;
const reg = /\{\$.*?\$\}/gm;
const marks = string.innerText.match(new RegExp(reg));


const list = document.createElement('ul');
for (mark in marks){
  let tag = marks[mark];
  let raw = tag.substring(2,tag.length-2);
  let li = document.createElement('li');
  li.innerText = raw;
  list.appendChild(li);

  // console.log("tag is: "+tag);
  // console.log(newstring.replace(tag, "REPLACED"));
  newstring = newstring.replace(tag, replace[raw]);

}

console.log(newstring);
string.innerText = newstring;

const display = document.getElementById('result');
display.appendChild(list);


// console.log(marks);
})
