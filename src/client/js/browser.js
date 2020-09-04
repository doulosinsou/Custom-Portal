window.addEventListener("load", start)

function start(){
console.log("js connected");
document.getElementById("auth").addEventListener("submit", giveToken);
}

async function giveToken(){
  event.preventDefault();
  console.log("made form request to server");
  const form = document.getElementById("auth");
  const data = {
    name: form.name.value,
    pass: form.pass.value
  }
  console.log(data);
  const check = await postIt('/calc', data);
  console.log("authentication response is:"+check);
  document.getElementById('token').innerHTML = check;

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
