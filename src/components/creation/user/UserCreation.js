import React, {Component} from 'react';
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom';
import "../../../style/cards.css"

// const genderOptions=[
//     {value: 'male', label: 'Male'},
//     {value: 'female', label: 'Female'},
//     {value: 'non binary', label: 'Non binary'}
// ]
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
                password: this.state.password,
                userName: this.state.name,
                gender: this.state.gender,
                nationality: this.state.nationality,
                birthDate: this.state.birthDate,
                cityOfBirth: this.state.cityOfBirth,
                phoneNumber: this.state.phoneNumber,
                admin: this.state.admin
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
                <div className="Container">
                    <label>
                        <h4>Email:</h4>
                        <input type="text" name="email" value={this.state.email} onChange={this.handleChange}></input>
                    </label>
                    <label>
                        <h4>Password:</h4>
                        <input type={false?'text':'password'} name="password" 
                        value={this.state.password} onChange={this.handleChange}></input>
                    </label>
                    <label>
                        <h4>Name:</h4>
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange}></input>
                    </label>
                    <label>
                        <h4>Gender:</h4>
                        <input type="text" name="gender"  value={this.state.gender} onChange={this.handleChange}></input>
                    </label>
                    <label>
                        <h4>Nationality:</h4>
                        <input type="text" name="nationality"  value={this.state.nationality} onChange={this.handleChange}></input>
                    </label>
                    <label>
                        <h4>Phone number:</h4>
                        <input type="text" name="phoneNumber"  value={this.state.phoneNumber} onChange={this.handleChange}></input>
                    </label>
                    <label>
                        <h4>City of birth:</h4>
                        <input type="text" name="cityOfBirth"  value={this.state.cityOfBirth} onChange={this.handleChange}></input>
                    </label>

                    <label>
                        <h4>Birthdate (yyyy-MM-dd):</h4>
                        <input type="text" name="birthDate" value={this.state.birthDate} onChange={this.handleChange}></input>
                    </label>
            
                    {/* <Select
                        value={gender}
                        onChange={this.handleChangeGender()}
                        options={genderOptions}
                    /> */}
                    {/* <h1>email: {this.state.email} <br/>password: {this.state.password}<br/>  name: {this.state.name}<br/> birth: {this.state.birthDate}<br/> phone: {this.state.phoneNumber}</h1> */}
                    <br/>
                    
                    <button onClick={this.handleSubmit}>Create account</button>
                    <br/>
                    <button><Link to="/login">Sign in</Link></button>
                </div>
            );  
        }
        else
            return (<Redirect to={'/login'}/>);
    }
}

export default Creation;