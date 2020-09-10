window.addEventListener("load", start);

function start(){
  permission,



}

function getCookie(name){
  const match = document.cookie.match(new RegExp('(^|)' + name + '=([^;]+)'));
  if (match) return match[2];
}

async function permission(){
  const token = getCookie("login");

  const get = await fetch("/portal/me", {
    method:'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
  }
  })
  try{
    const response = await get.json();
      console.log("your username is: "+response.name); document.getElementById("userName").innerHTML = "Welcome "+response.name;
  }

  }catch(error){
    console.log(error);
  }
}
