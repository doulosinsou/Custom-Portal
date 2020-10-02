<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>{$title$}</title>

  <link href="/css/main.css" rel="stylesheet">

  <script src="/js/{$js$}"></script>
  <script src="/js/{$validatejs$}"></script>

</head>
<body>
  <header>
    <h1>Moyer Audio App</h1>
    <h2>Portal: Home</h2>
    <div class="user">
      <a class="barbut" id = "username" href="/portal/me">{$username$}</a>
      <button class="barbut" id = "logout" onclick="logout()">Logout</button>
    </div>
  </header>
<a href="{$backto$}" id="back">Back</a>
