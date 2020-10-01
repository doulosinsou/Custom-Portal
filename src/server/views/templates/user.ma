<main>
    <section>
      <h3>Account Settings</h3>
      <p>Username: {$username$}</p>
      <p>Title: {$job$}</p>
      <p>Role: {$role$}</p>

      <h3>Personal Settings</h3>
      <form id="personal_form" method="POST">
        <label for="name">Name:</label>
          <input type="text" name="name" value="{$name$}">
        <label for="email">Email:</label>
          <input type="text" name="email" value="{$email$}">
        <label for="address">Address:</label>
          <input type="text" name="address" value="{$address$}">
        <label for="phone">Phone:</label>
          <input type="tel" name="phone" data-JSON="phone.base" pattern="(\d{1}(-| )?)?(\d{3}(-| )?)?\d{3}(-| )?\d{4}" value="{$phone.base$}">
        <span><label for="ext">Ext:</label>
          <input type="tel" name="ext" data-JSON="phone.ext" pattern="\d{3,6}" value="{$phone.ext$}"></span>
        <label for="cell">Personal Cell:</label>
          <input type="tel" name="cell" data-JSON="phone.personal.cell" pattern="(\d{1}(-| )?)?(\d{3}(-| )?)?\d{3}(-| )?\d{4}" value="{$phone.personal.cell$}">
        <button id = "personal">Update</button>
        <p id="personal_message"></p>
      </form>

      <h3>Login Settings</h3>
      <button id="showpass">Reset Password</button>
      <form class="hidden" id="password_form" method="POST">
        <label for="old_pass">Old Password</label>
          <input type="password" name="old_pass" id="old_pass">
        <label for="new_pass">New Password</label>
          <input type="password" name="new_pass" id="new_pass">
        <label for="confirm_pass">Confirm new Password</label>
          <input type="password" name="confirm_pass" id="confirm_pass">
        <p class="hidden" id="pass_suggestions">Secure passwords must have:<br>
          <ul>
            <li>At least one numerical digit (1-9)</li>
            <li>At least one lowercase letter (a-z)</li>
            <li>At least one uppercase letter (A-Z)</li>
            <li>At least one special character (like: !," etc)</li>
            <li>Between 8 and 32 characters in length</li>
          </ul>
        </p>
        <p id="pass_alert"></p>
        <button>Change Password</button>
        <p>Changing password will take you to the login screen to re-login with the new password</p>
      </form>


      <aside>
      * Some browsers require activity within 7 days or the account will logout automatically
      </aside>
    <section>
  </main>
