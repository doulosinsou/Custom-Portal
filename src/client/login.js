window.addEventListener("load", start)

function start(){
console.log("js connected");
// logCheck;
document.getElementById("log").addEventListener("submit", login);
document.getElementById("next").addEventListener("click",
logCheck);
}

const postIt = async (url = '', data = {})=>{
  const call = await fetch(url, {
    method:'POST',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  })
  try{
    const response = await call.json();
    return response;
  }catch(error){
    console.log(error);
  }
};

async function login(){
  event.preventDefault();
  console.log("made login request to server");
  const form = document.getElementById("log");
  const userData = {
    name: form.name.value,
    password: form.pass.value,
  };
  const valid = validate(userData, "logErr");
  if (!valid) throw "invalid entry";

  const check = await postIt('/login', userData);

  console.log("authentication response is: ");
  console.log(check);

  addCookie("login", check.token, 6);

  logCheck;
}

function validate(userData, warning){
  const warn = document.getElementById(warning);
  console.log(userData);
  if (userData.nameExists){
    warning.innerHTML = userData.nameExists;
  }else{
    for (data in userData){
      if (!userData[data]) {
        warning.innerHTML = warning.innerHTML + "<br> Please enter "+userData[data]
      }else{
        return true;
      }
    }
  }
}

function addCookie(name, data, months){
  const today = new Date();
  today.setMonth(today.getMonth()+ months);
  const expires = "expires ="+today.toUTCString();
  document.cookie = name+'='+data+';'+expires+'; SameSite=Strict; Secure; path=/';
}

function getCookie(name){
  const match = document.cookie.match(new RegExp('(^|)' + name + '=([^;]+)'));
  if (match) return match[2];
}

async function logCheck(){
  // const token = getCookie("login");
  // if (!token) return false;
  const redirect = await fetch("/portal");

  // const call = fetch("/home", {
  //   method:'POST',
  //   credentials: 'same-origin',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'x-access-token': token
  //   }
  // });
  try{
    const response = await redirect;
    console.log("logCheck fetch response is:");
    console.log(response.url);
    window.location.href = response.url;

  }catch(err){
    console.log(err);

  }
}
