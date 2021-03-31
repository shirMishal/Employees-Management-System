# Employee status management system

### Running instructions:
In order to run whole application: from root folder run "yarn dev"
In order to run server: from root folder run "node server.js"

### description:

server side :
database manipulation functions
Get Post request handlers
open conection to database and listen to requests

client side:
LandingPage:
    1. login form: only existing users can login.
    2. register form: new user can apply with name and email- once registered, status is set as working and employee is added to dataBase 
                      if existing user try to register he will login (if email address exist in the database) name filed is been ignored at authentication but must contain some value 
    after login/register user is redirected to loggedInPage
LoggedInPage:
    1. hello message with current logged in employee name and status
    2. dropDown button to update employee Status
    3. employees list- contains all other employees and their status. employees on vacation are red colored
        list has search by name and filter by status options (including intersection both options)
