import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import "../../style/authentication/SignupStyle.css";
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Dropdown} from 'office-ui-fabric-react/lib/Dropdown';
import Moment from 'moment';
import Host from '../../Host'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import { MenuItem, Select } from '@material-ui/core';

const genderOptions = [
    { value: 'male', label: 'Male'},
    { value: 'female', label: 'Female' },
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
        console.log(this.state.email)
        console.log(this.state.password)
        console.log(this.state.birth)
        console.log(this.state.phone)
        console.log(this.state.gender)
        await axios({
            method: 'post',
            url: Host()+'api/user',
            data: {
                email: this.state.email,
                password: this.state.password,
                userName: this.state.name,
                gender: this.state.gender,
                nationality: '',
                birthDate: Date.parse(Moment(this.state.birth.replace("_", "")).format('DD/MM/yyyy')),
                cityOfBirth: '',
                phoneNumber: (this.state.phone).replace("_",""),
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
                    <div className="sign_up_component">
                        <div className="sign_up_title_container" >
                            <h2>Sign up</h2>
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
                            <TextField label="Phone number" name="phone" onChange={this.handleChange} />
                    
                            <TextField label="Birthday" type="date" name="birth" onChange={this.handleChange} defaultValue="2020-01-15"/>
                            
                            <Select label="Gender" name="gender" value={this.state.gender} onChange={this.handleChange}> 
                               
                                    <MenuItem key={"male"} value="male"> 
                                        Male
                                    </MenuItem>
                                        
                                    
                                    <MenuItem key={"female"} value="female">
                                        Female
                                    </MenuItem>
                               
                            </Select>
                            {/* <Dropdown
                                onChange={(event, option) =>  this.setState({
                                    gender: option.key
                                })}
                                placeholder="Select an option"
                                label="Gender"
                                options={genderOptions}/> */}
                        </div>
                      
                        <div className="sign_up_buttons_container" >
                            <Button disableElevation style={{fontWeight:'bold'}}  color="default " variant='contained'href="/authenticate"> Sign in</Button>
                            <Button disableElevation style={{fontWeight:'bold'}}  color="primary" variant='contained' style={{ float: 'right'}}onClick={this.handleSubmit}>Create Account</Button>
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