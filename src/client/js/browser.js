window.addEventListener("load", start)

function start(){
console.log("js connected");
document.getElementById("auth").addEventListener("submit", register);
}

async function register(){
  event.preventDefault();
  console.log("made form request to server");
  const form = document.getElementById("auth");
  const userData = {
    name: form.name.value,
    email: form.email.value,
    password: form.pass.value,
  }
  // console.log(userData);
  const valid = validate(userData);
  if (!valid) throw "invalid entry";
  console.log("ready to 'check'");
  const check = await postIt('/user/register', userData);

  console.log("authentication response is: ");
  console.log(check);
  if (check.nameExists) validate(check);
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

function validate(userData){
  const warning = document.getElementById('warning');
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
