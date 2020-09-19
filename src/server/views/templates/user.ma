<main>
    <section>
      <h3>Account Settings</h3>
      <p>Title: {$job$}</p>
      <p>Role: {$role$}</p>

      <h3>Personal Settings</h3>
      <form id="personal_form">
        <label for="name">Name:</label>
        <input type="text" name="name" value="{$name$}">
        <label for="email">Email:</label>
        <input type="text" name="email" value="{$email$}">
        <label for="address">Address:</label>
        <input type="text" name="address" value="{$address$}">
        <label for="phone">Phone:</label>
        <input type="tel" name="phone" pattern="(\d{1}(-| )?(\d{3}(-| )?\d{3}(-| )\d{4}" value="{$phone.base$}">
        <span><label for="ext">Ext:</label>
        <input type="tel" name="ext" pattern="\d{3,6}" value="{$phone.ext$}"></span>
        <label for="cell">Personal Cell:</label>
        <input type="tel" name="address" pattern="(\d{3}(-| )?\d{3}(-| )\d{4}" value="{$phone.personal.cell$}">
        <button id = "personal">Update</button>
        <p id="personal_message"></p>
      </form>

      <h3>Login Settings</h3>
      <p>Reset password </p>


      <aside>
      * Some browsers require activity within 7 days or the account will logout automatically
      </aside>
    <section>
  </main>
