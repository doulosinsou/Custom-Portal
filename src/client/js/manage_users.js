window.addEventListener("load", start);

async function start(){

// console.log(document.querySelector('title').innerText);

if (document.querySelector('title').innerText === "User List"){
  poptable()
  .then(()=>{
     updateAdmin("active")
     updateAdmin("role")
     deleteUser()
  })

  document.getElementById('auth').addEventListener("submit", register)
}




if (document.querySelector('title').innerText === "User Info"){
  document.getElementById('upjob').addEventListener("click", userform)
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

        if (n === "active"){
          const drop = document.createElement('select');
          drop.classList.add("active");
          const act = document.createElement('option');
          const inact = document.createElement('option');
          act.value = 1;
          act.innerText="active"
          inact.value=0;
          inact.innerText="inactive"

          if (users[i][n] == 1) act.selected = true;
          if (users[i][n] == 0) inact.selected = true;

          drop.append(act);
          drop.append(inact);
          td.append(drop);

          // const update = document.createElement('button');
          // update.classList.add("update-active");
          // update.innerText = "update";
          // td.append(update);

        }else if(n === "role"){
          const drop = document.createElement('select');
          drop.classList.add("role");
          const admin = document.createElement('option');
          const user = document.createElement('option');
          admin.value = "admin";
          admin.innerText="admin"
          user.value="user";
          user.innerText="user"

          if (users[i][n] === "admin") admin.selected = true;
          if (users[i][n] === "user") user.selected = true;

          drop.append(admin);
          drop.append(user);
          td.append(drop);


        }else{
          td.innerText = users[i][n];
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
  return "done"
}

function deleteUser(){
  const del = document.getElementsByClassName("delete");
  for (i of del){
    i.addEventListener("click", function(el){
      const user = el.target.name;
      // postIt('/portal/deleteUser', el.target.name)
    })
  }
}


function userform(){
  const path = window.location.pathname;
  const username = path.substr(path.lastIndexOf('/') +1);
  const job = document.getElementById("jobtitle").value;
  const update = {
    username: username,
    job: job
  }
  postIt('/portal/adminUpdate', update);


}

//helper to update admin changes
function updateAdmin(item){
  // console.log(item)
  const x = document.getElementsByClassName(item);

  for (i of x){
    i.addEventListener("change", function(){
      const obj = {};
      obj[item] = i.value;
      postIt('portal/adminUpdate', obj);
    })
  }
  // return true
}

async function register(){
  event.preventDefault();
  const form = document.getElementById("auth");
  const userData = {
    username: form.username.value,
    email: form.email.value
  };

  const check = await postIt('/register/request', userData);

  const comment = document.getElementById('comment')
  if (check.nameExists){
    comment.innerHTML = "Username already exists";
  }else{
    comment.innerHTML = "New User sent email to sign up"
  }

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
