import React, {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../profile/ProfileStyle.css";
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';

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
        <div className="profile_container">
            <div className="profile_background_image_container">
                <img style={{borderRadius:'8px'}} src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgICAgICAgHBwcHBwoHBwcHBw8ICQYKFREWFhURExMYHCggGBoxGxMTITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0ODg0NEisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKsBJwMBIgACEQEDEQH/xAAWAAEBAQAAAAAAAAAAAAAAAAAAAQb/xAAWEAEBAQAAAAAAAAAAAAAAAAAAgRH/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQcF/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzoDitUCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAIKgCoAAAAAKIAAAKgAAAAKAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z"/>
            </div>
            <div className="profile_persona_container"> 
                <Persona
                    {...{
                        text:(profile.name),
                        secondaryText: (profile.email),
                        imageUrl: (profile.imageURL)
                    }}
                    size={PersonaSize.size56}
                    imageAlt="Profile Image"
                />
            </div>
            <div className="profile_info_container">
                <ul>
                    <li>
                        <p style={{ fontSize: FontSizes.size14, fontWeight:FontWeights.regular }}>{profile.phoneNumber}</p>
                    </li>
                    <li>
                        <p style={{ fontSize: FontSizes.size14, fontWeight:FontWeights.regular,lineBreak:'anywhere' }}>aBOUT ABOUTaBOUT ABOUTaBOUT ABOUTaBOUT ABOUTaBOUT ABOUTaBOUT ABOUTaBOUT ABOUTaBOUT ABOUT</p>
                    </li>
                    
                </ul>
            </div>
            <div className="profile_buttons_container">
                <div style={{gridRow:'1', gridColumn:'4'}}>
                    <DefaultButton text ="Followers" style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold,width:'7vw' }} href="/followers"/>
                </div>
                <div style={{gridRow:'2', gridColumn:'4'}}>
                    <DefaultButton text ="Following" style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold,width:'7vw' }} href="/following"/>
                </div>
                <div style={{gridRow:'1', gridColumn:'2'}}>
                    <DefaultButton disabled={true} text ="Edit" style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'7vw'}} href="/"/>
                </div>
                <div style={{gridRow:'2', gridColumn:'2'}}>
                    <PrimaryButton text="Signout" style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'7vw'}} href="/signout" />
                </div>
            </div>
            
        </div>
    );  
 
       
}

export default Profile;