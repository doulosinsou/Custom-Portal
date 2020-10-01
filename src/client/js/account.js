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
  for (let i=0; i<inputs.length; i++){ //cycle through all inputs
    const xm = inputs[i];
    if(xm.hasAttribute("data-JSON")){//see if data should be grouped (manually added to .ma)
      const json = xm.getAttribute("data-JSON");
      const split = json.split('.');
      for (let s = 1; s < split.length-1; ++ s) {//breakdown the string and make into nested objects
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

  const isValid = await validate(newpass);

  if(isValid.alert){
    alert.innerHTML = isValid.alert;
    return
  }

  if (newpass !== confirm){
    alert.innerHTML = "New Password and confirm password do not match";
  }

  const send = {
    oldPass: oldpass,
    newPass: newpass
  }
  console.log(send)

  const attempt = await submit("/portal/passreset", send);
  if (attempt.alert){
    alert.innerHTML = attempt.alert;
  }else{
    document.cookie = "login=''; max-age=0; SameSite=Strict; path=/";
    window.location.href = "/";
  }

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
