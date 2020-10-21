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
          wrapper.id = index.id;
    const content = make("p",["notice_content"]);
          content.innerText = index.comment;
          content.onclick = function(){showManage(this)};
          content.contentEditable = true;
    const titleWrapper = make("div", ["title_wrapper", "hidden"]);
    const done = make('span', ["done"]);
          done.innerText = "X";
          done.onclick = function(){showManage(this, 'done')};
    const title = make("h3", ["notice_title"]);
          title.innerText = index.notice;
          title.contentEditable = true;
    const edits = make("div", ["notice_edits", "flex", "hidden"]);
    const save = make("button", ["notice_save"]);
          save.innerText = "Save Changes"
          save.onclick = function(){changeNotice(this)};

    //make days pattern
    const pattern = make("div",["notice_pattern", "flex"]);
    const patDay = make("form", ["notice_day"]);
    const week = ["sun","mon","tue","wed","thu","fri","sat"];

      for (j of week){
        const day = make("input");
          if (index.pattern.match(j)){
            day.setAttribute("checked", true);
          }
        day.type = "checkbox";
        day.id = j;
        day.value = j;

        const label = make("label");
        label.setAttribute("for", j);
        label.innerText = j;

        patDay.append(day);
        patDay.append(label);

      }

      console.log(index.start)

    const start = make('input');
          start.name = "start";
          start.type = "date";
          start.value =index.start.slice(0,10);
    const end = make('input');
          end.name = "end";
          end.type = "date";
          end.value = index.end.slice(0,10);

    //drop down multiSelect for intended targets
    const targetWrapper = make('div',['target_wrapper'])
    const targetClick = make('span', ['click']);
          targetClick.innerText = "Target Audience";
          targetClick.setAttribute("onclick", "dropDown(this)");
           // .onclick = function(){dropDown(this)};
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
        const thi = item
        if (index.target.match(thi)){
          rol.classList.add("checked");
        }
      const inp = make('input');
            inp.type = "checkbox";
            inp.value = item;
            inp.id = item;
      const label= make('label');
            label.setAttribute("for", item);
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
  const board = document.getElementById("notice_board");
  for (index in data){
    console.log(data[index])
    if(data[index].active == true){
    const wrapper = make("div", ["notice_wrapper"]);
    const content = make("p",["notice_content"]);
          content.innerText = data[index].comment;

    wrapper.append(content);
    board.append(wrapper);
    }
  }
}

function changeNotice(el){
  const notice = el.closest(".notice_wrapper");
  const pattern = [];
  const days = notice.querySelectorAll('.notice_day input');
    for (i of days){
      if (i.checked){
        pattern.push(i.value);
      }
    }

  const targets = []
  const list = notice.querySelectorAll(".list .checked");
    for (i of list){
        targets.push(i.querySelector("input").value);
    }

  const changed = {
    id: notice.id,
    notice: notice.querySelector(".notice_title").innerText,
    comment: notice.querySelector(".notice_content").innerText,
    pattern: pattern,
    start: notice.querySelector("[name='start']").value,
    end: notice.querySelector("[name='end']").value,
    target: targets,
  };

  console.log(changed);
  postIt('/portal/admin/notice', changed);
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

//helper for Posting to server
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
