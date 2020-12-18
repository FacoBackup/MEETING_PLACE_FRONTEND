import React, {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../profile/ProfileStyle.css";
import { Button } from '@fluentui/react-button';
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
        <div className="profileContainer">
            <div className="imageContainer">
                <img style={{borderRadius:'8px'}} src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgICAgICAgHBwcHBwoHBwcHBw8ICQYKFREWFhURExMYHCggGBoxGxMTITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0ODg0NEisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKsBJwMBIgACEQEDEQH/xAAWAAEBAQAAAAAAAAAAAAAAAAAAAQb/xAAWEAEBAQAAAAAAAAAAAAAAAAAAgRH/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQcF/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzoDitUCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAIKgCoAAAAAKIAAAKgAAAAKAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z"/>
            </div>
            <div className="personaContainer"> 
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
            <div className="infoContainer">
                <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular }}>{profile.phoneNumber}</p>
                <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>PLACEHOLDER INFO</p>
                <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular }}>PLACEHOLDER INFO</p>
                <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular }}>PLACEHOLDER INFO</p>
            </div>
            <div className="profileButtonContainer">
                <Button style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} href="/followers">Followers</Button>
                <Button style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} href="/following">Following</Button>
            </div>
            
        </div>
    );  
 
       
}

export default Profile;