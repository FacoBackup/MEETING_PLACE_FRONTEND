import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import "./SignupStyle.css";
import { getTheme } from '@fluentui/react';
import { NeutralColors } from '@fluentui/theme';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Dropdown} from 'office-ui-fabric-react/lib/Dropdown';

const genderOptions = [
    { key: 'male', text: 'Male'},
    { key: 'female', text: 'Female' },
  ];

class SignUp extends Component{
    constructor(){
        super()
        this.state={
            sent: false,
            email: '',
            password: '', 
            name: '',
            phone: '',
            birth: '',
            gender:'',
            theme: getTheme()
                }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value 
        })
    }
    
    async handleSubmit(){
        
        await axios({
            method: 'post',
            url: 'http://192.168.15.35:8080/api/user',
            data: {
                email: this.state.email,
                password: this.state.password,
                userName: this.state.name,
                gender: this.state.gender,
                nationality: '',
                birthDate: this.state.birth.replace("_", ""),
                cityOfBirth: '',
                phoneNumber: this.state.phone,
                admin: false,
            }
            })
        .then(() => {   
            this.setState({
               sent: true
            });
        })
        .catch(error => {
            console.log(error)
            if(this.state.email !== '')
                alert("Some error occurred, maybe this email is already taken.")
            else alert("Some error occurred.")
        })
    }

    getErrorMessage (value) {
        return value.length >= 8 ? '' : `Input value must be more or equal to 8 characters.`;
    };

    render(){
        if(!this.state.sent){
            return (
                <div  className="sign_up_container">
                    <div style={{backgroundColor: NeutralColors.white,  boxShadow: this.state.theme.effects.elevation8 }} className="sign_up_component">
                        <div className="sign_up_title_container" >
                            <p style={{ fontSize: FontSizes.size24, fontWeight:FontWeights.semibold }}>Sign up</p>
                        </div>
                        <div className="sign_up_input_container">
                            <TextField label="Full name" name="name" onChange={this.handleChange}></TextField>
                     
                            <TextField label="Email address" name="email" onChange={this.handleChange}></TextField>
                      
                            <TextField
                                type="password"
                                label="Password"
                                name="password"
                                onChange={this.handleChange}
                                description="Max length is 64"
                                onGetErrorMessage={this.getErrorMessage}
                            />
                            <MaskedTextField label="Phone number" name="phone" onChange={this.handleChange} mask="(99) 99999-9999" />
                    
                            <MaskedTextField label="Birthday" name="birth" onChange={this.handleChange} mask="99-99-9999"/>
                        
                            <Dropdown
                                onChange={(event, option) =>  this.setState({
                                    gender: option.key
                                })}
                                placeholder="Select an option"
                                label="Gender"
                                options={genderOptions}/>
                        </div>
                      
                        <div className="sign_up_buttons_container" >
                            <DefaultButton text="Sign in" href="/authenticate" />
                            <PrimaryButton iconProps='Add' text="Create Account"  style={{ float: 'right'}}onClick={this.handleSubmit} />
                        </div>
                        
                    </div>
                </div>
            );  
        }
        else
            return (<Redirect to={'/authenticate'}/>);
    } 
}

export default SignUp;