import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class Login extends Component{
    constructor(props){
        super(props);
        this.state= {
            email:'',
            password: '',
            accepted: false,
        };
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    
    handleChangeEmail(event){
        this.setState({email: event.target.value});
    
    }
    handleChangePassword(event){
        this.setState({password: event.target.value});
    }

    async handleSubmit(event){
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/login',
            data: {
                email: this.state.email,
                password: this.state.password
            }
            })
            .then(response => {   
            if(response.Unauthorized){
                console.log(response)
                alert("wrong password or user name;")
            }
                
            else{
                cookies.set('JWT',response,{path:'/'});
                console.log(cookies.get('JWT'));
                this.setState({accepted: true});
            }
             
        })
        .catch(error => {
            console.log(error)
            alert("wrong password or user name;")
        })
    }
    
    render(){
        
        if(!this.state.sent){
            return (
                <div>
                    <label>
                        <h4>Email:</h4>
                        <input type="text" value={this.state.email} onChange={this.handleChangeEmail}></input>
                    </label>
                    <label>
                        <h4>Password:</h4>
                        <input type="text" value={this.state.password} onChange={this.handleChangePassword}></input>
                    </label>
                    <button onClick={this.handleSubmit}>Submit</button>
                </div>
            );    
        }
        else
        return (<Redirect to={'/user/'+this.state.email}/>);
        
    }   
}

export default Login;