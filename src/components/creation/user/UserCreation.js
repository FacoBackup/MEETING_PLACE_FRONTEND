import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import Select from 'react-select';

const genderOptions=[
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'},
    {value: 'non binary', label: 'Non binary'}
]
class Creation extends Component{
    constructor(props){
        super(props);
        this.state= {
            email:null,
            password: null,
            name: null,
            gender: null,
            nationality: null,
            phoneNumber: null,
            admin: true,
            cityOfBirth: null,
            birthDate: null,
            sent:false
        };
    
        this.handleChange = this.handleChange.bind(this);
     
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    
    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    
    }


    async handleSubmit(event){
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/user',
            data: {
                email: this.state.email,
                password: this.state.password
            }
            })
            .then(response => {   
            if(response.Unauthorized){
                console.log("Unauthorized")
                alert("wrong password or user name;")
            }
                
            else
                this.setState({sent: true})
        })
        .catch(error => {
            console.log(error)
            alert("wrong password or user name;")
        })
    }
    

    handleChangeGender = gender =>{
        this.setState({gender});
    }
    render(){

        if(!this.state.sent){
    //        const { gender } = this.state.gender;
            return (
                <div>
                    <label>
                        <h4>Email:</h4>
                        <input type="text" name="email" value={this.state.email} onChange={this.handleChange}></input>
                    </label>
                    <label>
                        <h4>Password:</h4>
                        <input type="text" name="password" value={this.state.password} onChange={this.handleChange}></input>
                    </label>
                    <label>
                        <h4>Name:</h4>
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange}></input>
                    </label>
                    <label>
                        <h4>Birthdate (yyyy-MM-dd):</h4>
                        <input type="text" name="birthDate" value={this.state.birthDate} onChange={this.handleChange}></input>
                    </label>
                    <label>
                        <h4>Phone number:</h4>
                        <input type="text" name="phoneNumber"  value={this.state.phoneNumber} onChange={this.handleChange}></input>
                    </label>
                    {/* <Select
                        value={gender}
                        onChange={this.handleChangeGender()}
                        options={genderOptions}
                    /> */}
                    {/* <h1>email: {this.state.email} <br/>password: {this.state.password}<br/>  name: {this.state.name}<br/> birth: {this.state.birthDate}<br/> phone: {this.state.phoneNumber}</h1> */}
                    <button onClick={this.handleSubmit}>Submit</button>
                </div>
            );  
        }
        else
            return (<Redirect to={'/profile/'+this.state.email}/>);
    }
}

export default Creation;