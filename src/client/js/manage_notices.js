window.addEventListener("load", poptable);
const tableQuery = "&table=users";

async function poptable(){
  const table = document.getElementById('manage-notices-table')
  const frag = document.createDocumentFragment();
  const callNotices = await fetch("/portal/notice");
  let notices = await callNotices.json();
  notices = notices.data
  //populate table from users objects
  for (i in notices){
    const notice = notices[i];
    const tr = make('tr');
          tr.id = notice.id;

    const title = make('td');
          title.innerText = notice.notice;
    const status = make('td');
          status.innerText = notice.active
    const schedule = make('td');
          schedule.innerText = "Input Pattern Here";
    const content = make('td');
    const edit = make('button');
          edit.innerText = "View and Edit";
          edit.onclick="editContent(this)";
    const hidden = make('div', ["hidden"]);
          hidden.innerText = notice.comment;
          content.append(hidden);
          content.append(edit);
    const author = make('td');
          author.innerText = notice.author;
    const del = make('td');
    const delbut = make('button',['delete']);
          delbut.innerText = "Delete";
          delbut.setAttribute("onclick","deleteNotice(this)")
          del.append(delbut);

          tr.append(title);
          tr.append(status);
          tr.append(schedule);
          tr.append(content);
          tr.append(author);
          tr.append(del);

      table.append(tr);

    return

    //more link
    const more = document.createElement('td');
    const morelink = document.createElement('a');
    morelink.href = "/portal/admin/user/"+users[i].username;
    morelink.innerText = "More";
    more.append(morelink);
    const name = tr.querySelector("td:nth-child(2)");
    name.after(more);

    //Delete user option
    if (users[i]["role"] !== "owner"){
      const del = document.createElement('td');
      const delbut = document.createElement('button');
      delbut.classList.add("delete");
      delbut.innerText = "Delete";
      delbut.setAttribute("onclick","deleteUser(this)");
      tr.append(delbut);
    }

      frag.append(tr);
  }
  table.append(frag);
  return "done"
}

//update admin changes
function updateAdmin(elem){
  const username = elem.closest('tr').querySelector("td").innerText;
  const sure = confirm("Confirm updating "+elem.name+" status of "+username);
  if (sure){
    const userQuery = "?username="+username;
    const update = {}
    update[elem.name] = elem.value;
    postIt('/portal/admin/update'+userQuery+tableQuery, update)
  }
}

function deleteUser(elem){
  const username = elem.closest('tr').querySelector("td").innerText;
  const sure = confirm("Confirm Deleting user "+username);
  if (sure){
    const userQuery = "?username="+username;
    const del = {};
    del.delete = true;
    postIt('/portal/admin/update'+userQuery+tableQuery, del)
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
