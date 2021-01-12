window.addEventListener("load", start)

function start(){
console.log("js connected");
  // const auth = document.getElementById("auth");
  // if (auth !== null){
  //   auth.addEventListener("submit", register);
  // }
  // const resForm = document.getElementById('reset');
  // if (resForm){
  //   reset.addEventListener("submit", reset);
  // }

  // This is for the password reset. Should move it to the reset page
  document.getElementById('reset').addEventListener("submit", reset)

  //For This file. Keep this.
  document.getElementById("auth").addEventListener("submit", register);
}

async function register(){
  event.preventDefault();
  const form = document.getElementById("auth");
  const userData = {
    username: form.username.value,
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
    document.getElementById(warning).innerHTML = userData.nameExists;
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
  // if (userData.nameExists){
  //   warn.innerHTML = userData.nameExists;
  //   return false
  // }else{
    const isValid = await validate(userData.pass);
    if(isValid.alert){
      warn.innerHTML = isValid.alert;
      return false;
    }else{
    return true;
    // }
  }
}

async function reset(){
  event.preventDefault();
  const form = document.getElementById("reset");

  const alert = document.getElementById('pass_alert');

  const isValid = await validate(form.new_pass.value);

  if(isValid.alert){
    alert.innerHTML = isValid.alert;
    return
  }

  if (form.new_pass.value !== form.confirm_pass.value){
    alert.innerHTML = "New Password and confirm password do not match";
    return
  }

  const param = new URLSearchParams(window.location.search).get("token");

  const userData = {
    pass: form.new_pass.value,
    token: param
  };
  console.log(userData)
  const check = await postIt('/register/newPass/', userData);
  window.location.href = check.redirect;

}
