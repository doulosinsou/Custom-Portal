window.addEventListener("load", start);

async function start(){
  const call = await fetch('/portal/notice');
  const notices = await call.json()
  if (notices.role === "admin" || notices.role === "owner"){
    buildNotices(notices.data);
  }else{
    showNotices(notices.data)
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
    const content = make("p",["notice_content"]);
          content.innerText = index.comment;
          content.onclick = function(){showManage(this)};
          content.contentEditable = true;
    const titleWrapper = make("div", ["title_wrapper", "hidden"]);    const done = make('span', ["done"]);
          done.innerText = "X";
          done.onclick = function(){showManage(this, 'done')};
    const title = make("h3", ["notice_title"]);
          title.innerText = index.notice;
          title.contentEditable = true;
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
          targetClick.onclick = function(){dropDown(this)};
    const targets = make('ul',['list', 'hidden']);

    for (n of roles){
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

    titleWrapper.append(title);
    titleWrapper.append(done);

    wrapper.append(titleWrapper);
    wrapper.append(content);
    wrapper.append(edits);

    frag.append(wrapper);

  }

  document.getElementById('notice_board').append(frag);
  return true;
}

//toggles visibility of admin edits to notices
function showManage(el, done){
  const title = el.closest(".notice_wrapper").querySelector(".title_wrapper");
  const edits = el.closest(".notice_wrapper").querySelector(".notice_edits");

  //close down edits
  if (done){
    title.classList.add("hidden");
    edits.classList.add("hidden");
  }else {
    title.classList.remove("hidden");
    edits.classList.remove("hidden");
  }
}

//edits target audience list toggle
function dropDown(el){
  const list = el.parentNode.querySelector('.list');
  list.classList.toggle('hidden');

  window.addEventListener("click", drop);
  // lets user check boxes on li click
  // closes list when clicked outside box
  function drop(){
    const lit = event.target.closest(".list");
    if (lit){
      const inputs = lit.querySelectorAll("input");
      const lis = lit.querySelectorAll("li");

      const li = event.target.closest("li");
      li.classList.toggle("checked");
      const checked = li.querySelector("input");
      checked.checked = !checked.checked;

      if(checked.value === "All"){
        inputs.forEach(me => me.checked = checked.checked)
        lis.forEach(me => {
          if (li.classList.contains("checked")){
            me.classList.add("checked")
          }else{
            me.classList.remove("checked")
          }
        })
      }
    }

    if (event.target != el && !lit){
      list.classList.add('hidden');
      window.removeEventListener("click", drop);
    }
  }
}

function showNotices(data){
  for (index of data){
    const board = document.getElementById("notice_board");
    const wrapper = make("div", ["notice_wrapper"]);
    const content = make("p",["notice_content"]);
          content.innerText = index.comment;

    wrapper.append(content);
    board.append(wrapper);
  }
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
