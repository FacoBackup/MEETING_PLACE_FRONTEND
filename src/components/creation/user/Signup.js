import React, {useState} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import "../user/SignupStyle.css";
import { getTheme } from '@fluentui/react';
import { NeutralColors } from '@fluentui/theme';
import { Button } from '@fluentui/react-button';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown} from 'office-ui-fabric-react/lib/Dropdown';

const genderOptions = [
    { key: 'male', text: 'Male'},
    { key: 'female', text: 'Female' },
    { key: 'Non binary', text: 'Non binary' },
  ];

function SignUp (){
    const theme = getTheme();
    const [sent, setSent] = useState(false);
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
    const [birth, setBirth] = useState('');
    function handleChangeBirth(event){
        setBirth(event.target.value);
    }
    const [gender, setGender] = useState(''); //SELECT    
    
    async function handleSubmit(){
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/user',
            data: {
                email: email,
                password: password,
                userName: name,
                gender: gender,
                nationality: '',
                birthDate: birth.replace("_", ""),
                cityOfBirth: '',
                phoneNumber: phone,
                admin: false
            }
            })
        .then(() => {   
            setSent(true);

        })
        .catch(error => {
            console.log(error)
            if(email !== '')
                alert("Some error occurred, maybe this email is already taken.")
            else alert("Some error occurred.")
        })
    }

    if(!sent){
        return (
            <div  className="signupContainer">
                <div style={{ boxShadow: theme.effects.elevation8,backgroundColor: NeutralColors.white }} className="signupComponent">
                    <div >
                        <p style={{ fontSize: FontSizes.size24, fontWeight:FontWeights.semibold }}>Sign up</p>
                    </div>
                    <div>
                        <TextField label="Full name" onChange={handleChangeName}></TextField>
                    </div>
                    <div>
                        <TextField label="Email address" onChange={handleChangeEmail}></TextField>
                    </div>
                    <div>
                        <TextField type="password" label="Password" onChange={handleChangePassword}></TextField>
                    </div>
                    
                    <div>
                        <MaskedTextField label="Phone number" onChange={handleChangePhone} mask="(99) 99999-9999" />
                    </div>
                    <div>
                        <MaskedTextField label="Birthday" onChange={handleChangeBirth} mask="99-99-9999"/>
                    </div>

                    <div>
                        <Dropdown
                            onChange={(event, option) =>  setGender(option.key)}
                            placeholder="Select an option"
                            label="Gender"
                            options={genderOptions}/>
                    </div>
                  
                    <div >
                        <Button style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} href="/authenticate">Sign in</Button>
                        <Button onClick={handleSubmit} style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} >Create</Button>
                    </div>
                    
                </div>
            </div>
        );  
    }
    else
        return (<Redirect to={'/authenticate'}/>);
}

export default SignUp;