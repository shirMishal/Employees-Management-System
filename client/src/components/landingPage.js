import React, {Component} from 'react';
import axios from 'axios';
//import WelcomeForm from './WelcomeForm';
//import {Redirect} from 'react-router-dom';

class LandingPage extends Component {
    state = {
        //response:'',//debug
        
        inputEmail:'',
        responseToLogin:[],
        tryToLogin: false,
        isAuthEmailAddess: false,//todo: not in use

        inputRegisterName:'',
        inputRegisterEmail:'',
        responseToRegister:[],
        tryToRegister: false,
        inputRegisterNickName:'',
    };
    
    // //Debug GET from server 
    ////component lifecycle creation
    // componentDidMount() {
    //     axios.get('http://127.0.0.1:5000/api/hello')
    //     .then(res => {//console.log(res); 
    //                     if (res.status !== 200) throw Error("Get request failed, status: ",res.status);
    //                     this.setState({ response: res.data.express });})
    //     .catch(err => console.log(err));
    // }
    


    handleLogin = async e => {
        this.setState({tryToLogin: true});
        e.preventDefault();  //a preventDefault is called on the event when submitting the form to prevent a browser reload/refresh.
        const post = {loginEmailAddress: this.state.inputEmail};
        //stringify happens automaticly
        axios.post('http://127.0.0.1:5000/api/login', post)
                .then(res=>{console.log(res);
                    if (res.statusText !== "OK") throw Error("Post request from handleRegister failed, status: ",res.status);               //if (JSON.stringify(res.data) !== '{}' ){
                    if ('email' in res.data){
                        localStorage.setItem('loggedInUser',JSON.stringify(res.data));
                        this.setState({ responseToLogin: res.data, tryToLogin: false });
                        this.props.history.push('/logged-in-page');
                    }
                    else{this.setState({tryToLogin: false });}
                    })
            .catch(err => console.log("error from handleSubmit: ",err));
    };
    
    handleRegister = async e => {
        this.setState({tryToRegister: true});
        e.preventDefault();  //a preventDefault is called on the event when submitting the form to prevent a browser reload/refresh.
        const post = {registerName: this.state.inputRegisterName, registerEmailAddress: this.state.inputRegisterEmail, registerNickName: this.state.inputRegisterNickName};
        //stringify happens automaticly
        if(post.registerName!=="" && post.registerEmail!==""){
            axios.post('http://127.0.0.1:5000/api/register', post)
                .then(res=>{console.log(res);//debug
                            if (res.statusText !== "OK") throw Error("Post request from handleRegister failed, status: ",res.status);
                            if ('email' in res.data){//existing user
                                localStorage.setItem('loggedInUser',JSON.stringify(res.data));
                                this.setState({ responseToRegister: res.data, tryToRegister: false });
                                this.props.history.push('/logged-in-page')
                            }
                            else if('insertedCount' in res.data && res.data.insertedCount===1){//new user
                                const newEmployee = {name: this.state.inputRegisterName , email: this.state.inputRegisterEmail, status: 0}
                                localStorage.setItem('loggedInUser',JSON.stringify(newEmployee));
                                this.setState({ responseToRegister: res.data, tryToRegister: false});
                                this.props.history.push('/logged-in-page')//Pushes a new entry onto the history stack
                                                                            //Use event.preventDefault else browser will reload and you end up back to / page.
                                                                        
                            }
                        })
                .catch(err => console.log("error from handleRegister: ",err));
        }else{this.setState({tryToRegister: false});}
    };

    render(){
        const formStyle = {margin: "20px auto"};
        return(
            <div className="LandingPage">
                {/*debug element to check the connection*//* <p>get: {this.state.response}</p> */}
                <h2 style={formStyle}>welcome to MyWorkStatus</h2>
                <form style={formStyle} onSubmit={this.handleLogin}>
                    <p><strong>Existing Users Login:</strong></p>
                    <input
                        type="text"
                        placeholder="Enter your email here"
                        value={this.state.inputEmail}//The input value attribute specifies an initial value for an input field
                        onChange={e => this.setState({ inputEmail: e.target.value })}
                    />
                    <button type="submit">Login</button>
                </form> 
                {this.state.tryToLogin ? 
                    <p>Loading...</p>: null}

                <form onSubmit={this.handleRegister}>
                    <p><strong>New Users Register:</strong></p>
                    <input
                        type="text"
                        placeholder="Enter your name here"
                        value={this.state.inputRegisterName}//The input value attribute specifies an initial value for an input field
                        onChange={e => this.setState({ inputRegisterName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Enter your nick name here"
                        value={this.state.inputRegisterNickName}//The input value attribute specifies an initial value for an input field
                        onChange={e => this.setState({ inputRegisterNickName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Enter your email here"
                        value={this.state.inputRegisterEmail}//The input value attribute specifies an initial value for an input field
                        onChange={e => this.setState({ inputRegisterEmail: e.target.value })}
                    />
                    <button type="submit">Register</button>
                </form> 
                {this.state.tryToRegister ? 
                    <p>Loading...</p>: null}                   
            </div>
        )  
    }
}
export default LandingPage;


