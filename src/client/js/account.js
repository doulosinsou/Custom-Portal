window.addEventListener("load", start);

function start(){

document.getElementById("personal_form").addEventListener(
"submit", personal)
}

async function personal(){
  event.preventDefault();
  const form = document.getElementById('personal_form');
  const formdata = new FormData(form);
  let sendInfo = {};
  for (value of formdata){
    sendInfo[value[0]]=value[1];
  }

  console.log(sendInfo);

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
