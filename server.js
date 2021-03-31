const express = require('express'); //To include a module, use the require() function with the name of the module
                                    //The Express.js framework makes it very easy to develop an application which can be used to handle multiple types of requests like the GET, PUT, and POST and DELETE requests.
const app = express(); //create an object of exspress module
const port = process.env.PORT || 5000; //Express server that will run on port 5000
const cors = require('cors')

const { MongoClient } = require("mongodb");
//  uri string = MongoDB deployment's connection string.
const uri ="";

const client = new MongoClient(uri,  { useUnifiedTopology: true });
var database = null;
var employees_data_collection = null;

async function openConnection() {
  try {
    await client.connect();
    database = client.db('employees');
    employees_data_collection = database.collection('employees_data');
    
    console.log("open connection to: ", database.databaseName);
  } 
  catch(err){
    console.log("open connection database failed: ", err);
  }
}

async function findEmployee(emailAddress) {
  try {
    // Query for a employee by email address
    const query = { email: emailAddress };
    const employee = await employees_data_collection.findOne(query);
    //console.log("from find employee: ", employee);//debug
    return employee;
  } catch {
    console.log("error from find employee ");
  }
}

async function getAllEmployees() {
  try {
    const query = {};
    const options = {
      // sort returned documents in ascending order by name (A->Z)
      sort: { name: 1 },
    // Include only the `name` and `status` fields in each returned document
      projection: { _id: 0, name: 1, email: 1 , status: 1, nickName:1},
    };
    const employees = await employees_data_collection.find(query,options);
    //console.log("from find employee: ", employees);//debug
    return employees.toArray();
  } catch (err) {
    console.log("error from getAllEmployees: ", err);
  }
}

async function updateStatus(newStatus, emailAddress) {
  try {
    // filter user to update by email address
    const filter = { email: emailAddress };
    //value to update
    const updateDoc = {
    $set: {
      status: newStatus
    },
    };
    const result = await employees_data_collection.updateOne(filter, updateDoc);
    console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);
    //console.log("from updateStatus ", result);//debug
    return result;
  } catch (err){
    console.log("error from from updateStatus: ",err);
  }
}

async function addEmployee(employeeData) {
  try{
    const employee = await findEmployee(employeeData.email);
    console.log("find employee result: ", employee);
    if (employee === null) {
      const result = await employees_data_collection.insertOne(employeeData);
      console.log(`${result.insertedCount} documents were inserted`,);
      //console.log("from updateStatus ", result);//debug
      return result;
    }else{return employee;}
  }catch(err){
    console.log("error from from addEmployee: ",err)
  }
  
}

//middleware - functions that execute during the lifecycle of a request to the Express server.
app.use(express.json());
//bodyParser.json()/express.json() Returns middleware that only parses json and only looks at requests where the Content-Type header 
//matches the type option. This parser accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings.

app.use(express.urlencoded({ extended: true }));
//bodyParser.urlencoded/express.urlencoded Returns middleware that only parses urlencoded bodies and only looks at requests where the 
//Content-Type header matches the type option. This parser accepts only UTF-8 encoding of the body and supports automatic 
//inflation of gzip and deflate encodings.

app.use(cors());
//the server can let the gates go wide open, and specify the wildcard value to allow all domains to access its resources:

// //GET - /api/hello //debug
// app.get('/api/hello', (req, res) => {
//   res.send({ express: 'Hello From Express' });
// });


app.post("/api/login", async(req, res) => {
  const  email  = req.body.loginEmailAddress;
  console.log("from api/login request: ",email);
  findEmployee(email)
  .then(employeeResult => (employeeResult === null) ? res.json({}) : res.json(employeeResult))
  .catch(err=>console.log ("error in findEmployee call from api/login: ",err));
});

app.post("/api/register", async(req, res) => {
  const  employeeData  = {name: req.body.registerName, nickName: req.body.registerNickName , email:req.body.registerEmailAddress, status:0};
  console.log("from api/register request: ",employeeData);
  addEmployee(employeeData)
  .then(employeeResult => res.json(employeeResult))
  //(employeeResult === null) ? res.json({}) : 
  .catch(err=>console.log ("error in findEmployee call from api/login: ",err));
});

app.post("/api/status", async(req, res) => {
  const  status  = req.body.newStatus;
  const email = req.body.emailAddress;
   // create a filter for a person to update
  console.log("from api/status request status: ",status);//debug
  console.log("from api/status request email: ",email);//debug
  updateStatus(status, email)
  .then(updateResult => {//console.log(updateResult);//debug
                          res.json(updateResult)})
  .catch(err=>console.log ("error in findEmployee call from api/login: ",err));
});

app.get('/api/employees', async(req, res) => {
  //console.log("from api/employees request");//debug
  getAllEmployees()
    .then(employeesResult => res.json(employeesResult))
    .catch(err=>console.log ("error in getAllEmployees call from api/employees: ",err));
});

openConnection()
  .then(app.listen(port, () => console.log(`Listening on port ${port}`)))
  .catch(err => {console.log(err);})







// //I didn't know where i should  call this method - not sure it's neccessary in real life server
// async function closeConnection() {
//   await client.close();
// }
// // closeConnection()
// //   .then(console.log("connection closed"))
// //   .catch(console.dir);


