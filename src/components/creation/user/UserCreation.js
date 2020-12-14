import React, {Component, useState} from 'react';
import axios from 'axios';
import {Redirect, Link} from 'react-router-dom';
import "../../../style/cards.css";
import Calendar from 'react-calendar';

// const genderOptions=[
//     {value: 'male', label: 'Male'},
//     {value: 'female', label: 'Female'},
//     {value: 'non binary', label: 'Non binary'}
// ]
function Creation (){

    const [sent, setSent] = useState(false);
    const [admin, setAdmin] = useState(true);

    const [email, setEmail] = useState('');
    function handleChangeEmail(event){
        setEmail(event.target.value);
    }
    const [password, setPassword] = useState('');
    function handleChangePassword(event){
        setPassword(event.target.value);
    }
    const [name, setName] = useState('');
    function handleChangeName(event){
        setName(event.target.value);
    }
    const [phone, setPhone] = useState('');
    function handleChangePhone(event){
        setPhone(event.target.value);
    }
    const [birth, setBirth] = useState(new Date());

    const [gender, setGender] = useState(''); //SELECT
    const [nationality, setNationality] = useState('');//SELECT
    const [cityOfBirth, setCityOfBirth] = useState('');//SELECT
    
    
    async function handleSubmit(){
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/user',
            data: {
                email: email,
                password: password,
                userName: name,
                gender: gender,
                nationality: nationality,
                birthDate: birth.toString(),
                cityOfBirth: cityOfBirth,
                phoneNumber: phone,
                admin: admin
            }
            })
        .then(() => {   
            setSent(true);

        })
        .catch(error => {
            console.log(error)
            alert("Some error occurred, maybe this email is already taken.")
        })
    }

    if(!sent){
        return (
            <div className="Container">
                <label>
                    <h4>Email:</h4>
                    <input type="text" value={email} onChange={handleChangeEmail}></input>
                </label>
                <label>
                    <h4>Password:</h4>
                    <input type={false?'text':'password'}
                    value={password} onChange={handleChangePassword}></input>
                </label>
                <label>
                    <h4>Name:</h4>
                    <input type="text" value={name} onChange={handleChangeName}></input>
                </label>
                {/* <label>
                    <h4>Gender:</h4>
                    <input type="text" name="gender"  value={this.state.gender} onChange={this.handleChange}></input>
                </label> */}
                {/* <label>
                    <h4>Nationality:</h4>
                    <input type="text" name="nationality"  value={this.state.nationality} onChange={this.handleChange}></input>
                </label> */}
                <label>
                    <h4>Phone number:</h4>
                    <input type="text"  value={phone} onChange={handleChangePhone}></input>
                </label>
                {/* <label>
                    <h4>City of birth:</h4>
                    <input type="text" name="cityOfBirth"  value={cityOfBirth} onChange={this.handleChange}></input>
                </label> */}

                <label>
                    <h4>Birthdate (yyyy-MM-dd):</h4>
                    <Calendar value={birth} onChange={setBirth}/>
                </label>
        
                {/* <Select
                    value={gender}
                    onChange={this.handleChangeGender()}
                    options={genderOptions}
                /> */}
                {/* <h1>email: {this.state.email} <br/>password: {this.state.password}<br/>  name: {this.state.name}<br/> birth: {this.state.birthDate}<br/> phone: {this.state.phoneNumber}</h1> */}
                <br/>
                
                <button onClick={handleSubmit}>Create account</button>
                <br/>
                <button><Link to="/login">Sign in</Link></button>
            </div>
        );  
    }
    else
        return (<Redirect to={'/login'}/>);
}

export default Creation;