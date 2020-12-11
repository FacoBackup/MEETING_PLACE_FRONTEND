import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import localIpUrl from 'local-ip-url';

const cookies = new Cookies();
class Login extends Component{
    constructor(props){
        super(props);
        this.state= {
            email:'',
            password: '',
        
            accepted: false,
        };
        this.handleChange = this.handleChange.bind(this);
    
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }
  

    async handleSubmit(event){
        const ip = require('local-ip-url');
        
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/login',
            data: {
                userID: this.state.email,
                password: this.state.password,
                ip: localIpUrl('public')
            }
            })
            .then(response => {   
                
                alert(response.data)
                cookies.set('JWT',response,{path:'/'});
                this.setState({accepted: true});
                        
            })
            .catch(error => {
                if(error.response.status === 401)
                    alert("Wrong password or email")
                else
                    alert("Some error occurred ("+error+ ").")
            })
    }
    
    render(){
        
        if(!this.state.sent){
            return (
                <div>
                    <label>
                        <h4>Email:</h4>
                        <input type="text" name="email" value={this.state.email} onChange={this.handleChange}></input>
                    </label>
                    <label>
                        <h4>Password:</h4>
                        <input type={false?'text':'password'} name="password" 
                        value={this.state.password} onChange={this.handleChange}></input>
                    </label>
                    <br/>
                    <button onClick={this.handleSubmit}>Submit</button>
                </div>
            );    
        }
        else
            return (<Redirect to={'/profile/'+this.state.email}/>);
        
    }   
}

export default Login;