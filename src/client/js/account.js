window.addEventListener("load", start);

function start(){

document.getElementById("personal").addEventListener(
"click", personal)
}

async function personal(){
  const form = document.getElementById('personal_form');
  const sent = await submit('/portal/personal', form);
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
