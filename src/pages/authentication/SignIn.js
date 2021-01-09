import React, {Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import localIpUrl from 'local-ip-url';
import "./SigninStyle.css"
import { getTheme } from '@fluentui/react';
import { NeutralColors } from '@fluentui/theme';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import Host from '../../Host'

class SignIn extends Component {
    constructor(){
        super()
        this.state={
            email: '',
            password:'',
            accepted: false,
            cookies: new Cookies(),
            theme: getTheme()
        }
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }
    
    
    componentDidMount(){
        this.checkToken()
    }
    
    checkToken (){     
        if(typeof this.state.cookies.get("JWT") !== 'undefined'){
            this.setState({
                accepted:true
            })
        }
    }

    handleChangeEmail (event)  {
        
        this.setState({
            email: event.target.value
        })
        event.preventDefault();
    }
    handleChangePassword (event)  {
        this.setState({
            password: event.target.value
        })
        event.preventDefault();
    }

    handleSubmit = async () => {
    
        await axios({
            method: 'put',
            url: Host()+'api/login',
            headers:{'Access-Control-Allow-Origin': '*'} ,
            data: {
                userID: this.state.email,
                password: this.state.password,
                ip: localIpUrl('public')
            }
            })
            .then(response => {   
                this.state.cookies.set('JWT',response.data,{path:'/'});
                this.state.cookies.set('ID',this.state.email,{path:'/'});
                this.setState({
                    accepted:true
                })    
            })
            .catch(error => {
                if(typeof error.response !== 'undefined' && error.response.status === 401)
                    alert("Wrong password or email")
                else
                    alert("Some error occurred ("+error+ ").")
            })
    }
    
    render(){
        if(this.state.accepted)
            return (<Redirect to='/'/>);
        else{
            return (
                <div className="sign_in_container">
                    <div style={{ boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white }}  className="sign_in_component">
                        <div className="sign_in_title_container">
                            <p style={{ fontSize: FontSizes.size24, fontWeight:FontWeights.semibold }}>Sign in</p>
                        </div>
                        <div className="sign_input_container">
                            <TextField label="Email address" onChange={this.handleChangeEmail}/>
                            <TextField type="password" label="Password" onChange={this.handleChangePassword}/>
                        </div>

                        <div className="sign_button_container">
                            <PrimaryButton text="Sign in" onClick={this.handleSubmit}/>
                            <DefaultButton text="Sign up" href="/creation"/>
                        </div>

                    </div>
                </div>
            );    
        }  
    }
     
}

export default SignIn;