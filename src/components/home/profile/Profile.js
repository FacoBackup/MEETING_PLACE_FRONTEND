import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../../style/cards.css"

function Profile(){
 
    const [profile, setProfile] = useState({});
    const cookies = new Cookies();
    
    useEffect(()=>{
        fetchData();
    },[]);
    
    const fetchData = async () => {
        await axios({
            method: 'get',
            url: 'http://localhost:8080/api/user',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT").data}
        }).then(res=>{
            setProfile(res.data);
        })
        .catch(error => {
            console.log(error)
        });
    }


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

            </div>

        
    );  
}

export default Profile;