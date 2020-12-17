import React, {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../profile/ProfileStyle.css";
import { Button } from '@fluentui/react-button';
import { FontSizes, FontWeights } from '@fluentui/theme';

function Profile(){
 
    useEffect(()=>{
        fetchData();
    },[]);

    const [profile, setProfile] = useState({});
    const cookies = new Cookies();
    
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

    return(
        <div className="profileContainer">
            <div  >
                <img src="data:image/png;base64,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"/>
                <ul >
                    <li>{profile.email}</li>
                    <li>phoneNumber: {profile.phoneNumber}</li>
                    <li>about: {profile.about}</li>
                    <li>image: {profile.imageURL}</li>
                    <li>birthDate: {profile.birthDate}</li>
                    <li>cityOfBirth: {profile.cityOfBirth}</li>
                    <li>nationality : {profile.nationality}</li>
                </ul>
                <div>
                    <Button style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} href="/followers">Followers</Button>
                    <Button style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} href="/following">Following</Button>
                </div>
            </div>
        </div>
    );  
 
       
}

export default Profile;