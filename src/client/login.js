window.addEventListener("load", start)

function start(){
console.log("js connected");
// logCheck;
document.getElementById("log").addEventListener("submit", sequence);
document.getElementById("next").addEventListener("click",
logCheck);
}

async function sequence(){
  login()
  .then(function(check){
    addCookie("login", check.token, 6);
  })
  .then(function(req){
      logCheck()
  })
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
  const form = document.getElementById("log");
  const userData = {
    name: form.name.value,
    password: form.pass.value,
  };
  const valid = validate(userData, "logErr");
  if (!valid) throw "invalid entry";

  const check = await postIt('/login', userData);

  return check;
}

function validate(userData, warning){
  const warn = document.getElementById(warning);
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

async function addCookie(name, data, months){
  const today = new Date();
  today.setMonth(today.getMonth()+ months);
  const expires = "expires ="+today.toUTCString();
  document.cookie = name+'='+data+';'+expires+'; SameSite=Strict; Secure; path=/';
  return "setcookie";
}

function getCookie(name){
  const match = document.cookie.match(new RegExp('(^|)' + name + '=([^;]+)'));
  if (match[2] === "null") return false;
  if (match) return match[2];
}

async function logCheck(){
  const token = getCookie("login");
  if (!token) {console.log("No Token in cookies"); return false;}
  const redirect = await fetch("/port", {
    method:'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    // body: {access_origin:"login-page"}
  });
  const json = await redirect.json();

  if (!json.redirect){
    console.log("failed to login");
    document.getElementById('comment').innerHTML = "Failed to Login";
}else{

    console.log("ready to go");
    console.log(json.redirect)
    window.location.href = json.redirect;
  }

}
