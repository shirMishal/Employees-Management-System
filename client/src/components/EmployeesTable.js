import React, { Component} from 'react';
import axios from 'axios';
import './EmployeesTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';



class EmployeesTable extends Component {
    
    state = {
        loggedInUserEmail: this.props.loggedInUserEmail,
        employees:[],
        nameSearchInput:'',
        statusFilterInput:4
    };
    //statusFilter: 0-working 1-on vacation 2-lunch 3-trip 4-all
    
    //creation lifeCycle Method after first render
    componentDidMount(){
        axios.get('http://127.0.0.1:5000/api/employees')
        .then(res => {console.log(res); //debug
                        if (res.statusText !== "OK") throw Error("Get /api/employees request failed, status: ",res.status);
                        const employeesList = res.data.filter(employee => employee.email !== this.state.loggedInUserEmail)
                                                        .map((employee) => {const statusStr = this.props.getStatusString(employee.status);
                                                                            return {name: employee.name, email: employee.email, status: statusStr, nickName:employee.nickName};
                                                        });
                        //console.log(employeesList);//debug
                        this.setState({ employees: employeesList });
            })
        .catch(err => console.log(err));
    }

    renderTableData() {
        return this.state.employees.filter(employee=> 
                                            (employee.name.toLowerCase().includes(this.state.nameSearchInput.toLowerCase())))
                                    .filter((employee)=>{ if(this.state.statusFilterInput === 4){return true;}
                                                        else{return employee.status === this.props.getStatusString(this.state.statusFilterInput)}
                                    })
                                    .map((employee) => {
                                    let { name, email, status, nickName} = employee; //destructuring
                                    var colorString ;
                                    colorString = (status===this.props.getStatusString(1)) ?  "#E9573F" : "#FFFFFF";
                                    //console.log(nickName);

                                    return (
                                        <tr style={{backgroundColor: colorString}} key={email}>
                                            <td className="employees-table-td">{nickName || name }</td>
                                            <td className="employees-table-td">{email}</td>
                                            <td className="employees-table-td">{status}</td>
                                        </tr>
                                    )
                                    })
     }

     renderTableHeader() {
        const titles = ['Name', 'Email', 'Status'];
        return titles.map((key, index) => {
           return <th className="employees-table-th"key={index}>{key}</th>
        })
     }

    handleFilterStatus(status){
        this.setState({ statusFilterInput: status });
    }

    render(){
        return(
            <div className="EmployeeTableDiv">
                <input className="search-by-name-input"
                    type="text"
                    placeholder="Search By Name"
                    value={this.state.nameSearchInput}//The input value attribute specifies an initial value for an input field
                    onChange={e => this.setState({ nameSearchInput: e.target.value })}                    
                    />
                <DropdownButton className="search-by-status" id="dropdown-basic-button" title="filter by status">
                    <Dropdown.Item onClick={() =>this.handleFilterStatus(4)}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() =>this.handleFilterStatus(0)}>Working</Dropdown.Item>
                    <Dropdown.Item onClick={() =>this.handleFilterStatus(1)}>On Vacation</Dropdown.Item>
                    <Dropdown.Item onClick={() =>this.handleFilterStatus(2)}>Lunch Time</Dropdown.Item>
                    <Dropdown.Item onClick={() =>this.handleFilterStatus(3)}>Business Trip</Dropdown.Item>
                </DropdownButton>
               <table  className="employees-table" >
               <tbody>
                    <tr>{this.renderTableHeader()}</tr>
                    {this.renderTableData()}
               </tbody>
            </table>
            </div>
        );
    }

}

export default EmployeesTable;

