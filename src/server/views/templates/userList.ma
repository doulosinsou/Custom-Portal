<main>
  <section id="table_wrapper">
    <table id="users" style="width:100%; text-align:left">
      <tr>
        <th>Username</th>
        <th>Preferred Name</th>
        <th>More Info</th>
        <th>Role</th>
        <th>Active Status</th>
        <th></th>
      </tr>
    </table>
  </section>
  <section>
    <button id="addUser">Add User</button>
    <div id="newUser" class="hidden">
      <h2>Register New User</h2>
      <p id="comment"></p>
      <form id = "auth" method="POST">
        <label for="username">UserName</label>
        <input type="text" name="username" pattern="([a-zA-Z]+ ?){6,32}" required>
        <label for="email">email</label>
        <input type="email" name="email" required>
        <button id="subnewUser">Register</button>
      </form>
      <p id="warning"></p>
    </div>
  </section>
</main>
