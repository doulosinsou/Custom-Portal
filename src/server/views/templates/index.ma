<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Portal</title>

  <link href="/css/main.css" rel="stylesheet">

  <script src="/js/main.js"></script>

</head>
<body>
  <header>
    <h3>This is from the server/views/templatesdirectory</h3>
    <h1>Moyer Audio App</h1>
    <h2>Portal</h2>
  </header>
  <main>
    <section>
      <h3>Welcome back {$name$}</h3>
      <p>Your email is {$email$}</p>
      <p>Let's begin to set things up:</p>
    <button onclick="permission()">Who am I?</button>
    <br>
    <button onclick="logout()">logout</button>

    <br>

  </main>
  <footer>
    <p>Luke Moyer 2020</p>
  </footer>
</body>
</html>
