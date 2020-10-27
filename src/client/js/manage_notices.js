const jobs=[];
const roles=["All"];
window.addEventListener("load", ()=>{
  roleCall(); //establishes the roles and jobs of users
  poptable(); //creates list of all notices
});

async function roleCall(){
  const allCall = await fetch("/portal/admin/userList/allUsers");
  const allUsers = await allCall.json();

  for (i of allUsers){
    if (jobs.indexOf(i.job) === -1) jobs.push(i.job);
    if (roles.indexOf(i.role) === -1) roles.push(i.role);
  }
}

async function poptable(){
  const table = document.getElementById('manage-notices-table')
  const frag = document.createDocumentFragment();
  const callNotices = await fetch("/portal/notice");
  const allNotices = await callNotices.json();
  const notices = allNotices.data
  //populate table from notices
  for (i in notices){
    const notice = notices[i];
    const tr = make('tr');
          tr.id = notice.id;

    const update = make('td');
    const updateButton = make('button', ["update", "hidden"])
          updateButton.innerText="Update Row"
          updateButton.setAttribute("onclick", "callUpdate(this)")
          update.append(updateButton);
    const title = make('td',["notice_title"]);
          title.innerText = notice.notice;
          title.setAttribute("data-title","title");
          title.setAttribute("onclick", "this.addEventListener('input', function(){showUpdate(this)})")
          title.contentEditable = true;
    const status = make('td',["status"]);
    const pstat = make('p');
    const active = make('button');
          active.setAttribute("onclick", "activate(this)");
          console.log(notice.active)
          if(notice.active == true){
            tr.classList.add("active");
            status.setAttribute("data-active","true");
            pstat.innerText = "Active";
            active.innerText = "Disable";
          }else{
            status.setAttribute("data-active", "false");
            pstat.innerText = "Disabled";
            active.innerText = "Activate";
          }
          status.append(pstat);
          status.append(active);

    const schedule = make('td');
          // schedule.innerText = "Input Pattern Here";

          //make days pattern
          const pattern = make("div",["notice_pattern"]);

          const patDay = make("ul", ["notice_day"]);
          const week = ["sun","mon","tue","wed","thu","fri","sat"];

            for (j of week){
              const li = make("li");
              const day = make("input");
                if (notice.pattern.match(j)){
                  day.setAttribute("checked", true);
                }
              day.type = "checkbox";
              day.id = j;
              day.value = j;

              const label = make("label");
              label.setAttribute("for", j);
              label.innerText = j;

              li.append(day);
              li.append(label);
              patDay.append(li);
            }

          const patRange = make("div",["date_range", "flex"]);

          const startWrap = make("div",["pat_date"]);
          const startTitle = make("p");
                startTitle.innerText = "From";
          const start = make('input');
                start.name = "start";
                start.type = "date";
                start.value =notice.start.slice(0,10);
                startWrap.append(startTitle)
                startWrap.append(start)

          const endWrap = make("div",["pat_date"]);
          const endTitle = make("p");
                endTitle.innerText = "To"
          const end = make('input');
                end.name = "end";
                end.type = "date";
                end.value = notice.end.slice(0,10);
                endWrap.append(endTitle);
                endWrap.append(end);

                patRange.append(startWrap);
                patRange.append(endWrap);

          pattern.append(patDay);
          pattern.append(patRange);
          schedule.append(pattern);


    const content = make('td', ["hidden-content"]);
    const edit = make('button');
          edit.innerText = "View and Edit";
          edit.setAttribute("onclick", "toggleEditNotice(this)");
    const hidden = make('div', ["hidden"]);
          hidden.innerText = notice.comment;
          hidden.setAttribute("data-content","content");
          content.append(hidden);
          content.append(edit);
    const targ = make('td');
          targ.append(targets(notice));
    const author = make('td');
          author.innerText = notice.author;
    const del = make('td');
    const delbut = make('button',['delete']);
          delbut.innerText = "Delete";
          delbut.setAttribute("onclick","deleteNotice(this)")
          del.append(delbut);

          tr.append(update);
          tr.append(title);
          tr.append(status);
          tr.append(schedule);
          tr.append(content);
          tr.append(targ);
          tr.append(author);
          tr.append(del);

      frag.append(tr);
  }
  table.append(frag);
}

//update admin changes
// function updateAdmin(elem){
//   const username = elem.closest('tr').querySelector("td").innerText;
//   const sure = confirm("Confirm updating "+elem.name+" status of "+username);
//   if (sure){
//     const userQuery = "?username="+username;
//     const update = {}
//     update[elem.name] = elem.value;
//     postIt('/portal/admin/update'+userQuery+tableQuery, update)
//   }
// }

function deleteNotice(elem){
  const noticeId = elem.closest('tr').id;
  const notice = elem.closest('tr').querySelector('td').innerText;
  const sure = confirm("Confirm Deleting notice "+notice);
  if (sure){
    const userQuery = "?username="+username;
    const del = {
      delete:true,
      id:noticeId
    };
    postIt('/portal/admin/notice', del)
  }
  location.reload();
}

function toggleEditNotice(elem){
   document.getElementById('edit-content-popup').classList.toggle("hidden");
  if (elem){
    const row = elem.closest("tr");
    const content = row.querySelector("[data-content]").innerText; document.getElementById("edit_content").value = content;

    document.getElementById("close-pop").addEventListener("click", function (el){
      row.querySelector("[data-content]").innerText = document.getElementById("edit_content").value;
      toggleEditNotice();
    })
    showUpdate(elem);
  }
}

function showUpdate(elem){
  const row = elem.closest("tr");
  const upBut = row.querySelector(".update");
  upBut.classList.remove("hidden");
}

function callUpdate(elem){

  const notice = elem.closest("tr");
  console.log(notice)
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
        notice: notice.querySelector("[data-title='title']").innerText,
        comment: notice.querySelector("[data-content='content']").innerText,
        pattern: pattern,
        // start: notice.querySelector("[name='start']").value,
        // end: notice.querySelector("[name='end']").value,
        target: targets,
      };

      console.log(changed);
      // postIt('/portal/admin/notice', changed);

}

// async function editNotice(data){
//   const update = await postIt("/portal/admin/notice", data);
//   // location.reload();
// }

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

//make the target Audience list
function targets(notice){
  //drop down multiSelect for intended targets
  const targetWrapper = make('div',['target_wrapper'])
  const targetClick = make('span', ['click']);
        targetClick.innerText = "Select";
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
      if (notice.target.match(thi)){
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

  return targetWrapper;
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

function activate(el){
  const row = el.closest('tr');
  const status = row.querySelector(".status");
  const pstat = status.querySelector('p');
  const active = status.querySelector("button");

  if(status.getAttribute("data-active") === "true"){
    postIt("/portal/admin/notice", {
      id:row.id,
      active: 0
    });
    status.setAttribute("data-active", "false");
    pstat.innerText = "Disabled";
    active.innerText = "Activate";
    row.classList.remove("active");
  }else{
    postIt("/portal/admin/notice", {
      id:row.id,
      active:1
    });
    status.setAttribute("data-active", "true");
    pstat.innerText = "Active";
    active.innerText = "Disable";
    row.classList.add("active");
  }
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
