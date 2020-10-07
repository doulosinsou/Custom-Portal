window.addEventListener("load", start);

async function start(){
  const call = await fetch('/portal/notice');
  const notices = await call.json()
  if (notices.role === "admin" || notices.role === "owner"){
    manageNotices(notices.data)
  }else{
    // showNotices(notices.data)
  }

}

function manageNotices(data){
  document.getElementById('notice_board').innerText = data[0].comment;
}



function logout(){
  console.log("logout called");
  document.cookie = "login=''; max-age=0; SameSite=Strict; path=/";
  window.location.href = "/";
}
