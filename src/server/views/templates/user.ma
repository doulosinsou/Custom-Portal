<main>
  <section>
    <h3>Username: {$user.username$}</h3>
    <p><i>Preferred Name</i>: {$user.name$}</p>
    <p><i>Job title</i>: {$user.job$}</p>
    <p><i>Date joined</i>: {$user.signup$}</p>
    <p><i>Last Active</i>: {$user.lastactive$}</p>
  </section>
  <section>
    <h3>Submitted Personal Information</h3>
    <p><i>Email</i>: {$user.email$}</p>
    <p><i>Address</i>: {$user.address$}</p>
    <p><i>Work Phone</i>: {$user.phone.base$}</p>
    <p><i>ext</i>: {$user.phone.ext$}</p>
    <p><i>Personal Phone</i>: {$user.phone.personal.cell$}</p>
  </section>
</main>
