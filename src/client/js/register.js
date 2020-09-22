window.addEventListener("load", start)

function start(){
console.log("js connected");
document.getElementById("auth").addEventListener("submit", register);
}

async function register(){
  event.preventDefault();
  const form = document.getElementById("auth");
  const userData = {
    name: form.name.value,
    email: form.email.value,
    pass: form.pass.value,
    verification: form.verify
  };
  const valid = await vali(userData, "warning");
  console.log(valid)
  if (!valid){
    return "invalid entry";
  }
  const check = await postIt('/register/request', userData);

  if (check.nameExists){
    vali(check, "warning");
  }else{
    window.location.href = check.redirect;
  }

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

async function vali(userData, warning){
  const warn = document.getElementById(warning);
  if (userData.nameExists){
    warn.innerHTML = userData.nameExists;
    return false
  }else{
    const isValid = await validate(userData.pass);
    if(isValid.alert){
      warn.innerHTML = isValid.alert;
      return false;
    }else{
    return true;
    }
  }
}
