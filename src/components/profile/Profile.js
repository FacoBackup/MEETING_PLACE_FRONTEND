import React, {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../profile/ProfileStyle.css";
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { useBoolean } from '@uifabric/react-hooks';

function Profile(){
 
    useEffect(()=>{
        fetchData();
    },[]);

    const [profile, setProfile] = useState({});
    
    const cookies = new Cookies();
    
    const [editMode, setEditMode] = useState(false);
    const [about, setAbout] = useState('');
    function handleChangeAbout(event){
        setAbout(event.target.value)   
        const newMultiline = about.length > 50;
        if (newMultiline !== multiline)
            toggleMultiline();
     
    }
    const [nationality, setNationality] = useState('');
    function handleChangeNationality(event){
        setNationality(event.target.value)   
    }
    const [birthCity, setBirthCity] = useState('');
    function handleChangeBirthCity(event){
        setBirthCity(event.target.value)   
    }
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
    
    function edit(){
        setEditMode(!editMode)
    }

    const [multiline, { toggle: toggleMultiline }] = useBoolean(false);
    
    function getErrorMessageAbout (value) {
        return value.length < 512 ? '' : `Input value must be less than 512 characters.`;
    };    
    
    function getErrorMessage (value) {
        return value.length < 128 ? '' : `Input value must be less than 128 characters.`;
    };

    async function submitChanges (){
        await axios({
            method: 'patch',
            url: 'http://localhost:8080/api/profile',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
            data:{
                about : about,
                nationality : nationality,
                city: birthCity,
                name: null,
                imageURL: null
            }
        }).then(()=>{
            edit()
            fetchData()
        })
        .catch()
    
    }

    if(editMode === false){
        return(
            <div className="profile_container">
                <div className="profile_background_image_container">
                    <img style={{borderRadius:'8px', width:'17.5vw'}} src={(profile.imageURL === null) ?  profile.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU"}/>
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
                            <TextField label="About You" readOnly placeholder={profile.about} />
                        </li>
                        <li>
                            <TextField label="Your Phone Number" readOnly placeholder={profile.phoneNumber} />
                        </li>
                        <li>
                            <TextField label="Your Nationality" readOnly placeholder={profile.nationality} />
                        </li>
                        <li>
                            <TextField label="Your city of birth" readOnly placeholder={profile.cityOfBirth} />
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
                        <DefaultButton  text ="Edit" style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'7vw'}} onClick={edit}/>
                    </div>
                    <div style={{gridRow:'2', gridColumn:'2'}}>
                        <PrimaryButton text="Sign out" style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'7vw'}} href="/signout" />
                    </div>
                </div>
                
            </div>
        );  
    }
    else{
        return(
            <div className="profile_container">
            <div className="profile_background_image_container">
                <img style={{borderRadius:'8px', width:'17.5vw'}} src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgICAgICAgHBwcHBwoHBwcHBw8ICQYKFREWFhURExMYHCggGBoxGxMTITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0ODg0NEisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKsBJwMBIgACEQEDEQH/xAAWAAEBAQAAAAAAAAAAAAAAAAAAAQb/xAAWEAEBAQAAAAAAAAAAAAAAAAAAgRH/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQcF/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzoDitUCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAIKgCoAAAAAKIAAAKgAAAAKAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z"/>
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
            <div className="profile_edit_info">
                <ul>
                    <li>
                        <MaskedTextField label="Phone number" mask="(99) 99999-9999" />
                    </li>
                    <li>
                    <TextField
                        label="About you"
                        placeholder={(profile.about)}
                        multiline={multiline}
                        description="Max length is 512 characters"
                        onChange={handleChangeAbout}
                        onGetErrorMessage={getErrorMessageAbout}
                    />
                    </li>
                    <li>
                        <TextField
                            label="Your nationality" 
                            placeholder={profile.nationality} 
                            description="Max length is 128 characters"
                            onChange={handleChangeNationality}
                            onGetErrorMessage={getErrorMessage}
                        />
                    </li>
                    <li>
                    <TextField
                            label="Your city of birth" 
                            placeholder={profile.cityOfBirth} 
                            description="Max length is 128 characters"
                            onChange={handleChangeBirthCity}
                            onGetErrorMessage={getErrorMessage}
                        />
                    </li>
                </ul>   
            </div>
            <div>
                <div className="profile_edit_info_buttons">
                    <DefaultButton text ="Cancel" style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold,width:'auto'}} onClick={edit}/>
                    <PrimaryButton text ="Save modifications" style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold,width:'auto', height:'auto' }} onClick={submitChanges}/>    
                </div>
            
            </div>
            
        </div>
        )
    }
 
       
}

export default Profile;