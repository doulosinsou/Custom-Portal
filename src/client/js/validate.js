async function validate(password){
  if (!(new RegExp("[0-9]+").test(password))){
    console.log("[0-9] is false")
    return {valid:false, alert:"Please use at least one numerical digit in password"};
  }else

  if (!(new RegExp("[a-z]+").test(password))){
    return {valid:false, alert:"Please use at least one lowercase letter in password"};
  }else

  if (!(new RegExp("[A-Z]+").test(password))){
    return {valid:false, alert:"Please use at least one uppercase letter in password"};
  }else

  if (!(new RegExp("[*.!@#$%^&(){}:;<>,.?/~_+=|]+|\-+|[\"\']+", "g").test(password))){
    return {valid:false, alert:"Please use at least one special character in password"};
  }else

  if (!(new RegExp(".{8,32}", "g").test(password))){
    return {valid:false, alert:"Please use between 8 and 32 characters in password"};
  }else{
    return true
  }
}
