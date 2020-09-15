window.addEventListener("load", start)

function start(){
console.log("js connected");
document.getElementById("log").addEventListener("submit", login);
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
  console.log("login called");
  console.log(check);
  if (check.warning){
    document.getElementById('comment').innerHTML = check.warning;
  }else{
    window.location.href = "/portal";
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
