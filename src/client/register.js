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
  const valid = validate(userData, "warning");
  if (!valid) throw "invalid entry";
  const check = await postIt('/register/request', userData);

  if (check.nameExists){
    validate(check, "warning");
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

function validate(userData, warning){
  const warn = document.getElementById(warning);
  if (userData.nameExists){
    warn.innerHTML = userData.nameExists;
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
