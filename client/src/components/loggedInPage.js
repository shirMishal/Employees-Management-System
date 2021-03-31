import React, {Component} from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import EmployeesTable from './EmployeesTable';

class LoggedInPage extends Component {

    state = {
        isLoggedInUser: false,
        loggedInUserName: '',
        loggedInUserEmail: '',
        loggedInUserStatus: -1,
        
        handleUpdateStatus: false,
        statusUpdatedSuccessfully: false,
    };
    
    
    componentDidMount() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        const userName = userData.name;
        const userEmail = userData.email;
        const userStatus = userData.status;
        this.setState({ 
            isLoggedInUser: true,
            loggedInUserName: userName,
            loggedInUserEmail: userEmail,
            loggedInUserStatus:userStatus});
      }
    }
    getStatusString = (status) =>{
        switch (status){
            case 0:
                return "Working";
            case 1:
                return "On Vacation";
            case 2:
                return "Lunch Time";
            case 3:
                return "Business Trip";
            default:
                return "unknown";

        }
    }
    
    handleUdateStatus = async (status, e) => {
        e.preventDefault();  //a preventDefault is called on the event when submitting the form to prevent a browser reload/refresh. React uses synthetic events to handle events from button, input and form elements. 
        if (status !== this.state.loggedInUserStatus){
            this.setState({ handleUpdateStatus: true, statusUpdatedSuccessfully: false});
            const postData = {newStatus: status, emailAddress: this.state.loggedInUserEmail};
            //stringify happens automaticly
            axios.post('http://127.0.0.1:5000/api/status', postData)
                    .then(res=>{//console.log(res);//debug
                                if (res.statusText !== "OK") {
                                    this.setState({ handleUpdateStatus: false});
                                    throw Error("Post request from handleUdateStatus failed, status: ",res.status);
                                }
                                console.log("from HandleUdateStatus: ", res.data);
                                if (res.data.matchedCount===1 && res.data.ok === 1){//update succeed
                                    console.log("from HandleUdateStatus: in success condition");
                                    //update user status in local storage
                                    var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                                    loggedInUser.status = status; 
                                    localStorage.setItem('loggedInUser',JSON.stringify(loggedInUser));
                                    //update state
                                    this.setState({ handleUpdateStatus: false, 
                                        statusUpdatedSuccessfully: true, 
                                        loggedInUserStatus: status});
                                }else{//failed to update
                                    console.log("from HandleUdateStatus: in fail condition");
                                    this.setState({ handleUpdateStatus: false, 
                                                    statusUpdatedSuccessfully: false,});
                                }  
                            })
                    .catch(err => console.log("error from handleSubmit: ",err));
        }//close if
    };

    

    render(){
        const hStyle = {marginTop: "50px", marginBottom: "20px"};
        const pStyle = {margin: "20px auto"};
        return(
            <div>
            {/* <p>logged-in page</p> */}
            {this.state.isLoggedInUser ?(
                <div>
                    <h4 style={hStyle}>Hello, {this.state.loggedInUserName}, your status is:  {this.getStatusString(this.state.loggedInUserStatus)}</h4>
                    <DropdownButton id="dropdown-basic-button" title="Update Your Status:">
                        <Dropdown.Item onClick={(e) => this.handleUdateStatus(0, e)}>Working</Dropdown.Item>
                        <Dropdown.Item onClick={(e) =>this.handleUdateStatus(1, e)}>On Vacation</Dropdown.Item>
                        <Dropdown.Item onClick={(e) =>this.handleUdateStatus(2, e)}>Lunch Time</Dropdown.Item>
                        <Dropdown.Item onClick={(e) =>this.handleUdateStatus(3, e)}>Business Trip</Dropdown.Item>
                    </DropdownButton>
                    {this.state.handleUpdateStatus ? <p style={pStyle}>Updating your status...</p>
                        : this.state.statusUpdatedSuccessfully ? <p style={pStyle} >Status updated!</p>
                        : null}
                    <h5 style={hStyle}>employees list:</h5>
                    <EmployeesTable loggedInUserEmail={this.state.loggedInUserEmail} getStatusString={this.getStatusString}/>
                </div>
            )
                :<p>You are not logged in</p>
            }
            </div>
            )
    }
}
export default LoggedInPage;