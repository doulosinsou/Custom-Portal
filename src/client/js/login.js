window.addEventListener("load", start)

function start(){
console.log("js connected");
logCheck();
status();
document.getElementById("log").addEventListener("submit", login);
document.getElementById("reset").addEventListener("submit", reset);
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
    username: form.username.value,
    password: form.pass.value,
  };
  const valid = validate(userData, "logErr");
  if (!valid) throw "invalid entry";
  const check = await postIt('/login', userData);
  console.log("login called");
  console.log(check);
  if (check.warning){
    document.getElementById('comment').innerHTML = check.warning;
  }else{
    window.location.href = "/portal/";
  }
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

async function logCheck(){
  const check = await fetch('/port', {
    method:'GET',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'}
  });
  const json = await check.json();
  if (json.render){
    window.location.href = json.render;
  }
}

function status(){
  const status = window.location.pathname;
  console.log(status);
  if(status === "/activated"){
    document.getElementById('comment').innerHTML = "Your account has been activated";
  }
}

async function reset(){
  event.preventDefault();
  const notice = document.getElementById('notice')
  const send = await postIt('/register/verify', {email: document.getElementById('reset').email.value});

  if (send.noEmail){
    notice.innerHTML = send.noEmail;
  }else{
    notice.innerHTML = "Please follow link in email to reset Password";
    document.getElementById('reset').email.value = "";
  }
};
