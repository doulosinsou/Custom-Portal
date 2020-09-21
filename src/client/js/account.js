window.addEventListener("load", start);

function start(){

document.getElementById("personal_form").addEventListener(
"submit", personal);
document.getElementById("password_form").addEventListener(
"submit", resetPass);

}

async function personal(){
  event.preventDefault();
  const form = document.getElementById('personal_form');

  const inputs = form.querySelectorAll('input');
  let sendInfo = {};
  let objInfo = [];

  let ob = {}
  let rep = ob;
  for (let i=0; i<inputs.length; i++){
    const xm = inputs[i];
    if(xm.hasAttribute("data-JSON")){
      const json = xm.getAttribute("data-JSON");
      const split = json.split('.');
      for (let s = 1; s < split.length-1; ++ s) {
        rep = rep[split[s]] = {};
      }
      rep[split[split.length-1]] = inputs[i].value;
      if (objInfo[0]!== split[0]){
        objInfo.push(split[0]);
      }
    }else{
      sendInfo[xm.name] = xm.value
    }
  }
  objInfo.push(ob);
  sendInfo[objInfo[0]]=objInfo[1];

  const sent = await submit('/portal/personal', sendInfo);
  const message = document.getElementById('personal_message');
  message.innerHTML = sent.message;
  message.classList.add(sent.class);
}

async function resetPass(){
  event.preventDefault();
  const oldpass = document.getElementById("old_pass").value
  const newpass = document.getElementById("new_pass").value
  const confirm = document.getElementById("confirm_pass").value
  const alert = document.getElementById('pass_alert');

  console.log("working?");
  const isValid = await validate(newpass);
  if(!isValid.valid){
    alert.innerHTML = isValid.alert;

  }
return
  if (newpass !== confirm){
    alert.innerHTML = "New Password and confirm password do not match";
    return;
  }

  const send = {
    oldPass: oldpass,
    newPass: newpass
  }
  // const attempt = await submit("/portal/passreset", send);
  // if (attempt.alert){
  //   alert.innerHTML = attempt.alert;
  // }else{
  //   window.location.href = "/";
  // }

}

const submit = async (url = '', data = {})=>{
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

async function validate(password){
  if (!password.match(/(?=.*[0-9])/)) return {valid:false, alert:"Please use at least one numerical digit"};

  if (!password.match(/(?=.*[a-z])/)) return {valid:false, alert:"Please use at least one lowercase letter"};

  if (!password.match(/(?=.*[A-Z])/)) return {valid:false, alert:"Please use at least one uppercase letter"};

  // if (!password.match(/(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\])/)) return {valid:false, alert:"Please use at least one special character"};
  
  if (!password.match(/(.{8,32})/)) return {valid:false, alert:"Please use between 8 and 32 characters"};
  return true
}
