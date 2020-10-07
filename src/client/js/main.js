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

async function manageNotices(data){
  // console.log(data)
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

  const frag = document.createDocumentFragment();
  for (index of data){

    const wrapper = make("div", ["notice_wrapper"]);
    const content = make("p");
          content.innerText = index.comment;
    const title = make("h3", ["notice_title", "hidden"]);
          title.innerText = index.notice;
    const edits = make("div", ["notice_edits", "hidden"]);
    const save = make("button", ["notice_save"]);
          save.innerText = "Save Changes"

    //make days pattern
    const pattern = make("div",["notice_pattern"]);
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

        patDay.append(label);
        patDay.append(day);
      }

    const start = make('input');
    const end = make('input');

    //drop down multiSelect for intended targets
    const targetWrapper = make('div',['target_wrapper'])
    const targetClick = make('span', ['click']);
    const targets = make('ul',['list']);

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
  // document.getElementById('notice_board').innerText = data[0].comment;
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
