window.addEventListener("load", start)

function start(){
console.log("js connected");
document.getElementById("auth").addEventListener("submit", register);
document.getElementById("log").addEventListener("submit", login);
}

async function register(){
  event.preventDefault();
  console.log("made register request to server");
  const form = document.getElementById("auth");
  const userData = {
    name: form.name.value,
    email: form.email.value,
    password: form.pass.value,
  };
  // console.log(userData);
  const valid = validate(userData, "warning");
  if (!valid) throw "invalid entry";
  console.log("Passed Validator; ready to register");
  const check = await postIt('/register', userData);

  console.log("authentication response is: ");
  console.log(check);
  if (check.nameExists) validate(check, "warning");
  // return check;

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

  const check = await postIt('/user/login', userData);

  console.log("authentication response is: ");
  console.log(check);

  addCookie("login", check.token, 6);
  // return check;
  fetch("/portal/home", {
    method:'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }
  });
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

async function permission(){
  const token = getCookie("login");

  const get = await fetch("/portal", {
    method:'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
  }
  })
  try{
    const response = await get.json();
    console.log("status is "+response.status);
    if (!response.name){
      document.getElementById("userName").innerHTML = "You are not logged in";
  }else{
      console.log("your username is: "+response.name); document.getElementById("userName").innerHTML = "Welcome "+response.name;
      console.log("your ID is: "+response.ID);
  }

  }catch(error){
    console.log(error);
  }
}
