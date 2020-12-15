import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../style/cards.css"

function Profile(){
 
    const [profile, setProfile] = useState({});
    const cookies = new Cookies();
    
    useEffect(()=>{
        fetchData();
    },[]);
    
    async function fetchData (){
        if(typeof cookies.get("JWT") !== 'undefined'){
            await axios({
                method: 'get',
                url: 'http://localhost:8080/api/user',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT")}
            }).then(res=>{
                setProfile(res.data);
            })
            .catch()
        }         
    }

    if(typeof cookies.get("JWT") !== 'undefined')
        return(
            <div className="Container">
            
                <h3>Profile</h3>
                <ul>
                    <li>name: {profile.name}</li>
                    <li>email: {profile.email}</li>
                    <li>phoneNumber: {profile.phoneNumber}</li>
                    <li>about: {profile.about}</li>
                    <li>image: {profile.imageURL}</li>
                    <li>birthDate: {profile.birthDate}</li>
                    <li>cityOfBirth: {profile.cityOfBirth}</li>
                    <li>nationality : {profile.nationality}</li>
                </ul>
                <Link to="/followers"><button>Followers</button></Link>
                <Link to="/following"><button>Following</button></Link>
            </div>
        );  
    else {
        return(<Redirect to={"/authenticate"} />)
    }
       
}

export default Profile;