window.addEventListener("load", start);

function start(){

console.log(document.querySelector('title').innerText);

if (document.querySelector('title').innerText === "User List"){
  poptable();
  changetable();
}

if (document.querySelector('title').innerText === "User Info"){
  
  userform();
}

}

async function poptable(){
  const table = document.getElementById('users')
  const frag = document.createDocumentFragment();
  const us = await fetch("/portal/userList/allUsers");
  const users = await us.json()

  //populate table from users objects
  for (i in users){
    const tr = document.createElement('tr');
      for (n in users[i]){
        const td = document.createElement('td');
        td.innerHTML = users[i][n];
        if (n === "active"){
          if (users[i][n] == 1){
            td.innerHTML = "active"
          }else{
            td.innerHTML = "inactive"
          }
        }
        tr.append(td);
      }

    //more link
    const more = document.createElement('td');
    const morelink = document.createElement('a');
    morelink.href = "/portal/user/"+users[i].username;
    morelink.innerText = "More";
    more.append(morelink);
    const name = tr.querySelector("td:nth-child(2)");
    name.after(more);

    //Delete user option
    const del = document.createElement('td');
    const delbut = document.createElement('button');
    delbut.classList.add("delete");
    delbut.name = users[i].username;
    delbut.innerText = "Delete";
    tr.append(delbut);

    frag.append(tr);

  }
  table.append(frag);

}

function changetable(){
  document.getElementById('')
}


function userform(){
  const path = window.location.pathname;
  const username = path.substr(path.lastIndexOf('/') +1);
  const job = document.getElementById("jobtitle").value;
  const update = {
    username: username,
    job: job
  }
  // postIt('/portal/adminUpdate', update);


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
