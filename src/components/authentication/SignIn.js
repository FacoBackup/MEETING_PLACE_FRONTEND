import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import localIpUrl from 'local-ip-url';
import "../authentication/SigninStyle.css"
import { getTheme } from '@fluentui/react';
import { NeutralColors } from '@fluentui/theme';
import { Button } from '@fluentui/react-button';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

function SignIn () {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accepted, setAccepted] = useState(false);
    const cookies = new Cookies();
    const theme = getTheme();

    useEffect(()=>{
        checkToken()
    })
    
    function checkToken (){     
        if(typeof cookies.get("JWT") !== 'undefined'){
            setAccepted(true);
        }
    }

    function handleChangeEmail (event)  {
        setEmail(event.target.value) ;
        event.preventDefault();
    }
    function handleChangePassword (event)  {
        setPassword(event.target.value);
        event.preventDefault();
    }
    const handleSubmit = async () => {

        await axios({
            method: 'put',
            url: 'http://localhost:8080/api/login',
            headers:{'Access-Control-Allow-Origin': '*'} ,
            data: {
                userID: email,
                password: password,
                ip: localIpUrl('public')
            }
            })
            .then(response => {   
                cookies.set('JWT',response.data.token,{path:'/'});
                cookies.set('ID',response.data.userID,{path:'/'});
                setAccepted(true);
                        
            })
            .catch(error => {
                if(error.response.status === 401)
                    alert("Wrong password or email")
                else
                    alert("Some error occurred ("+error+ ").")
            })
    }
    

    if(accepted)
        return (<Redirect to='/'/>);
    else{
        return (
            <div className="signInContainer">
                <div style={{ boxShadow: theme.effects.elevation8,backgroundColor: NeutralColors.white }}  className="signInComponent">
                    <div >
                        <p style={{ fontSize: FontSizes.size24, fontWeight:FontWeights.semibold }}>Sign in</p>
                    </div>
                    <div>
                        <TextField label="Email address" onChange={handleChangeEmail}></TextField>
                    </div>
                    <div>
                        <TextField type="password" label="Password" onChange={handleChangePassword}></TextField>
                    </div>

                    <div>
                        <Button onClick={handleSubmit} style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }}>Sign in</Button>
                        <Button style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} href="/creation">Sign up</Button>
                    </div>

                </div>
            </div>
        );    
    }   
}

export default SignIn;