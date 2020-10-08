window.addEventListener("load", start);

async function start(){
  const call = await fetch('/portal/notice');
  const notices = await call.json()
  if (notices.role === "admin" || notices.role === "owner"){
    buildNotices(notices.data)
    .then(()=>{
      manageNotices()
    })
  }else{
    // showNotices(notices.data)
  }

}

async function buildNotices(data){
  // make list of available roles and jobs
  const allCall = await fetch("/portal/admin/userList/allUsers");
  const allUsers = await allCall.json();
  const jobs=[];
  const roles=["All"];

  //make list of jobs and roles
  for (i of allUsers){
    if (jobs.indexOf(i.job) === -1) jobs.push(i.job);
    if (roles.indexOf(i.role) === -1) roles.push(i.role);
  }

  //build notices
  const frag = document.createDocumentFragment();
  for (index of data){

    const wrapper = make("div", ["notice_wrapper"]);
    const content = make("p");
          content.innerText = index.comment;
    const title = make("h3", ["notice_title", "hidden"]);
          title.innerText = index.notice;
    const edits = make("div", ["notice_edits", "flex", "hidden"]);
    const save = make("button", ["notice_save"]);
          save.innerText = "Save Changes"

    //make days pattern
    const pattern = make("div",["notice_pattern", "flex"]);
    const patDay = make("form", ["notice_day"]);
    const week = ["sun","mon","tue","wed","thu","fri","sat"];

      for (j of week){
        const day = make("input");
        day.type = "checkbox";
        day.name = j;
        day.value = j;

        const label = make("label");
        label.for = j;
        label.innerText = j;

        patDay.append(day);
        patDay.append(label);

      }

    const start = make('input');
    const end = make('input');

    //drop down multiSelect for intended targets
    const targetWrapper = make('div',['target_wrapper'])
    const targetClick = make('span', ['click']);
          targetClick.innerText = "Target Audience";
    const targets = make('ul',['list', 'hidden']);

    for (n of roles){
      console.log(n)
      list(n);
    }

    // const break = make('hr');
    // targets.append(break);

    for (n of jobs){
      list(n)
    }
    //helper to write the list
    function list (item){
      const rol = make('li');
      const inp = make('input');
            inp.type = "checkbox";
            inp.value = item;
      const label= make('label');
            label.for = item;
            label.innerText = item;
      rol.append(inp);
      rol.append(label);
      targets.append(rol);
    }
    targetWrapper.append(targetClick);
    targetWrapper.append(targets);

    pattern.append(patDay);
    pattern.append(start);
    pattern.append(end);
    pattern.append(targetWrapper);

    edits.append(save);
    edits.append(pattern);

    wrapper.append(title);
    wrapper.append(content);
    wrapper.append(edits);

    frag.append(wrapper);

  }

  document.getElementById('notice_board').append(frag);
  return true;
}

function manageNotices(){
  document.querySelectorAll(".notice_wrapper p").forEach(function(el){
    el.addEventListener("click", function(cl){
      console.log(cl.target.parentNode)

      const title = cl.target.parentNode.querySelector(".notice_title");
      const edits = cl.target.parentNode.querySelector(".notice_edits");

      title.classList.toggle("hidden");
      edits.classList.toggle("hidden");
    })
  })

  document.querySelectorAll('.click').forEach((me)=>{
    me.addEventListener("click", function(cl){
      cl.target.parentNode.querySelector('.list').classList.toggle('hidden');
    })
  })
}

function logout(){
  console.log("logout called");
  document.cookie = "login=''; max-age=0; SameSite=Strict; path=/";
  window.location.href = "/";
}

//helper for making elements
function make(tg, cl){
  const el = document.createElement(tg);
  if (cl){
    for (i of cl){
      el.classList.add(i);
    }
 }
  return el
}
