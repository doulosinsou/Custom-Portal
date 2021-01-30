# Moyer Audio portal
_A universal front end UX for Moyer Audio projects_

## Packages

I don't suppose this to be the best or the most secure. This is my first time through making a ux from scratch, and in many cases I prefer to make my own helpers and functions. Other times I am using existing node packages.

Here are my dependencies:
```
  "bcryptjs": "^2.4.3",
  "body-parser": "^1.19.0",
  "cookies": "^0.8.0",
  "cors": "^2.8.5",
  "dotenv": "^8.2.0",
  "express": "^4.17.1",
  "fs": "0.0.1-security",
  "jsonwebtoken": "^8.5.1",
  "nodemailer": "^6.4.11",
  "path": "^0.12.7",
  "sass": "^1.26.12"
```

## Begin the App

The process begins by running the npm "test" script: `node src/server/index.js`

### Setup

Node requires 'express' and applies the 'path', 'body-parser', and 'cors' to an express instance called 'app'.

Define constants as custom requires for .js files on the same directory:
- login.js (*handles user login from homepage*)
- Verify_Token.js (*processes all server requests and compares header cookies to authorized user ids*)
- user.js (*handles data and page requests of logged in users*)
- register.js (*processes submission to create a new account*)

Start the app on a custom port.

### Run the index app

1. Tell express to deliver a static page from 'scr/client', which will return the index.html homepage for login.
2. Pass all requests through __`verifyToken`__:
    1. require 'jsonwebtoken' (*for unpacking web token*) and 'dotenv' (*for providing the decoding secret*)
    2. check if req has NO cookie in the header
      - If it has no cookie, assign a blank variable (instead of undefined)
    3. Obtain the existing cookie which matches 'login = ____ ;'
    4. check if it can find the cookie
      - if the cookie returns false, return a req.err and move on
      - if the cookie is true, then assign the token variable with the cookie data
    5. call the verify method of 'jsonwebtoken', passing the token, the 'dotenv' secret, and the callback
    6. check for a jsonwebtoken error
      - if there is a problem decoding, set a req.error
      - if the decoding is successful, set the translated data as req.userId, for use in validation and data calls
    7. move to the next function
3. Pass req through internal function _isValid_
    1. If there is an err key in the req:
      - Console.log the err along with the call source
      - If the call source was supposed to go to '/portal':
        - boot the user back to the main page
      - If the endpath is '/activated' (*used for registration verification. Auto link generated to this path from email along with query*):
        - Send the index.html directly, so that the req.err in this case can be interpreted as a succesful verification (*since the account has yet to be logged in*)
      - If the request is to '/login' or '/register':
        - proceed (*This is after the user has been verified as logged in, therefore the logged in user who seeks to login or register will simply be taken to their custom homepage*)
    2. If there is no err key in the req, then the client is successfully logged in:
      - proceed
4. Pass all requests to url to the static index.html (*this is a repeat call for the sake of the logged in users as well as failed users and registration requests*)

## <a name="Registration"></a>Registration
**From the client/js/register.js activated by direct link in index.html**

_This is the static page linked from the index.html homepage_

1. When the window loads, begin the __`start`__ function
2. <mark>Move user __`reset`__ password somewhere else</mark>
3. Listen for register form submission. Call __`register`__ function
    1. prevent screen from refreshing
    2. Place form data into object with username, email, pass, and verification keys.
    3. send the form data through __`vali`__ function with a parameter for notice elementId
        1. Check the password against __`validate`__ function <mark>Must pass all form data through validator</mark>
        3. If __`validate`__ returns an alert key, then the validation failed:
          - Display notice of failed items to user
    4. if __`vali`__ returns False, then stop the process
    5. Post the validated form data to '/register/request'
**From the server/register.js called by register.html**
Require express and call the `Router()` method
Apply body-parser.
Require 'path', 'bcryptjs', '/mysql', and '/mail/mail_handler'
    1. establish a post route for '/request'
    2. pass the request through the local __`register`__ middleware
        1. Retrieve the current time of request and format it for SQL table
        2. call the local __`createUser`__ function, passing an object conatinaing the username, email, token, active status, and signup date (1. above)
            - (*The token serves the purpose of a unique verification url parameter to be sent by email. When user clicks on url, this token will be used as a single time customer ID to activate the account*)
            - Token is created by local function __`verifyCode()`__
                1. Generate random number (10^6)
                2. Ensure that the number is exactly 10^6 in length by adding '0's until the random number reaches 10^6
                3. Use `bcrypt` to hash the number (*make it impossible for a human to remember*)
                4. return hashed number as the token
            - The __`createUser`__ function is as follows:
                1. Check for return value of helper function __`exists`__, passing an object, column, and data to search the SQL database.
                    - Use the SELECT EXISTS sql query of the passed information
                    - [see sql file below](#mysql)
                    - return the boolean of that search
                2. If __`exists`__ returns true then that username submitted by the new registration request is already taken
                3. return the object key *nameExists*
                4. If the name is free to use: create columns and rows based on object passed to __`createUser`__ .
                5. Construct a query to create a new row from submitted data
                6. Discover the newly created row and return it to the __`createUser`__ call.
                7. Now the `created` variable which fetches __`createUser`__ is an object containing the actual data from the newly constructed row in the database
        3. check if `created` variable is false
            - if so return to the req that there was a problem with using the sql function
        4. check if a `nameExists` key is returned. This means the username is already taken
            - send an immediate response to the client with the `nameExists` key
        5. add the successfully created user row to the req
        6. Move to next function
    3. Move on the inline function:
        1. Declare an object with pertinent information for an email
        2. use the __`mailer`__ function which was required from '/mail/mail_handler'
        3. [See mailer function below](#mail_handler)


**From the client/js/register.js**
    1. If the server returns the key:nameExists, then display notice to user.
    2. If validation passes, then divert to user path (*In this case, simply going to homepage*)

    

## <a name="name"></a>Login
**From the client/js/login.js activated by index.html**

_This is the static page returned by the request to the server_

1. When the window loads, begin the __`start`__ function
2. Invoke the __`logCheck`__ function
    1. Make a GET request to '/port' using fetch
    2. (From server/index.js): get call to '/port'
        1. the req string passes through __`verifyToken`__ and __`isValid`__ .
        2. if the req has an error, the user is not logged in
          - close the connection (*user remains on loggin page*)
        3. if the req has no error, the user is already logged in:
          - return to the client the '/portal/' path to call directly through req.render key
          - this has a friendly 200 status to remind the browser that things are working as they should
          - the reason I do this is so that clients may call the '/portal/' path directly, and do not have to only return to the homepage to get to their custom UX.
          - But if the client does happen to go to the homepage, AND he is logged in, then the index.html will know that '/portal/' path is really what they are looking for
    3. (back to the login.js): json the returned data from '/port' call
    4. If the return data has a 'render' key, then divert the window page location to the path 'render' specifies (*in this case: '/portal/'*)
      - The reason I do it this way is that I don't want publicly accessable js files to tax the '/portal/' call
    5. Assuming the user is NOT logged in, and has not been diverted, then the user remains on this page and has completed the __`logCheck()`__ function
3. Invoke the __`status()`__ function
    1. If the end url path is "/activated" (*link generated from account verification email*) :
      - Deliver front end message
    2. __`status()`__ has completed, return to next __`start()`__ call
4. Listen for login form submission. call __`login`__ function
    1. Stop browser from refreshing (*that would cancel the req cycle*)
    2. obtain the form data, mainly the username and password
    3. pass data to __`validate`__ function along with a string defining the warning element id.
    4. <mark>Need to apply universal form Validator</mark>
    5. Submit the validated form data to the server path "/login" through the helper function __`postIt`__:
        1. declare an async arrow function
        2. fetch the parameters from the server
        3. try to json the response from server
        4. pass on valid data through return
        5. catch with a console.log error
    6. console.log the returned data from server
    7. If the data has a 'warning' key:
      - display the warning on the page
    8. If there is no warning, redirect the browser to  "/portal/" to call for the server to deliver a custom UX
    9. Go to [User Interface](#user-interface)
5. Listen for password reset submission. Call __`reset`__ function
    1. Stop page from refreshing
    2. Make Post request to server '/register/verify', sending the object key:email paired to the value of the user's email input
    3. Registration process described [below](#Registration)
    4. A return of key:noEmail displays a notice to the user
    5. Else a notice tells user to check their email


## <a name="mysql"></a>MySQL

## <a name="mail_handler"></a>Mail Handler

## <a name="user-interface"></a>User Interface
