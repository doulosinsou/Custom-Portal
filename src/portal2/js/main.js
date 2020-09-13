// window.addEventListener("load", start);

function start(){
  permission

}


function logout(){
  console.log("logout called");
  document.cookie = "login=''; max-age=0; SameSite=Strict; path=/";
  window.location.href = "/";

  //
  // const today = new Date();
  // today.setMonth(today.getMonth()+ months);
  // const expires = "expires ="+today.toGMTString();
  // const noComma = expires.replace(/,/g, '');

  // document.cookie = '"'+login+'='+data+'; '+expires+'; SameSite=Strict; Secure; path=/"';
  // const get = getCookie(name);
  // console.log('"'+name+'='+data+'; '+expires+'; SameSite=Strict; Secure; path=/"');
  // return "setcookie";
}

function getCookie(name){
  const match = document.cookie.match(new RegExp('(^|)' + name + '=([^;]+)'));
  if (match) return match[2];
}

async function permission(){
  const token = getCookie("login");
  //
  // const get = await fetch("/portal/me", {
  //   method:'GET',
  //   credentials: 'same-origin',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'x-access-token': token
  // }
  // })
  // try{
  //   const response = await get.json();
  //     console.log("your username is: "+response.name); document.getElementById("userName").innerHTML = "Welcome "+response.name;
  // }catch(error){
  //   console.log(error);
  // }
}
