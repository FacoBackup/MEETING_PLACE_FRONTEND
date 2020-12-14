import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import localIpUrl from 'local-ip-url';
import "../../style/cards.css"



function SignIn () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accepted, setAccepted] = useState(false);
    const cookies = new Cookies();

    useEffect(()=>{
        checkToken()
    })
    const checkToken = async () =>{     
        if(typeof cookies.get("JWT") !== 'undefined'){
            await axios({
                method: 'get',
                url: 'http://localhost:8080/api/verify/token',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT").data}
            }).then(res =>{
                setAccepted(true);
            }).catch(error=>{
                console.log(error)
            })
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
                cookies.set('JWT',response,{path:'/'});
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
            <div className="Container">
                <label>
                    <h4>Email:</h4>
                    <input type="text" name="email" value={email} onChange={handleChangeEmail}></input>
                </label>
                <label>
                    <h4>Password:</h4>
                    <input type={false?'text':'password'} name="password" 
                    value={password} onChange={handleChangePassword}></input>
                </label>
                <br/>
                <button onClick={handleSubmit}>Sign in</button>
                <button><Link to="/creation">Sign up</Link></button>
            </div>
        );    
    }   
}

export default SignIn;