window.addEventListener("load", start);

function start(){

document.getElementById("personal_form").addEventListener(
"submit", personal)
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
