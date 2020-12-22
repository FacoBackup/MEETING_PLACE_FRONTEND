import React, {Component, useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "./ProfileStyle.css";
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { useBoolean } from '@uifabric/react-hooks';
import QRcode from 'qrcode.react';

class Profile extends Component{
    constructor(){
        super()
        this.state={
            profile: {},
            cookies: new Cookies,
            editMode: false,
            about: "",
            nationality: '',
            birthCity: '',
            multiline: false
        }
        this.handleChangeAbout = this.handleChangeAbout.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getErrorMessage = this.getErrorMessage.bind(this)
        this.getErrorMessageAbout = this.getErrorMessageAbout.bind(this)
    }
    componentDidMount(){
        fetchData()
    }
    handleChangeAbout(event){
        setAbout(event.target.value)   
        const newMultiline = about.length > 50;
        if (newMultiline !== this.state.multiline)
            this.toggleMultiline();
     
    }
    handleChange(event){
        this.setState({
            [event.target.name] : event.target.value
        })   
    }
    fetchData = async() => {
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

    signout = async() => {
        if(typeof cookies.get("JWT") !== 'undefined'){
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/logout',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT")}
            }).then(()=>{

                Object.keys(cookies.getAll()).forEach(name => cookies.remove(name))
                localStorage.clear()
            })
            .catch(error=>{
                console.log(cookies.get("JWT"))
            }
            )
        }
    }

    edit(){
        setEditMode(!this.state.editMode)
    }

    toggleMultiline(){
        setEditMode(!this.state.multiline)
    }
    getErrorMessageAbout (value) {
        return value.length < 512 ? '' : `Input value must be less than 512 characters.`;
    };    
    
    getErrorMessage (value) {
        return value.length < 128 ? '' : `Input value must be less than 128 characters.`;
    };

    submitChanges = async() => {
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

    render(){
        if(this.state.editMode === false){
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
                       
                                <TextField label="About You" readOnly placeholder={this.state.profile.about} />
                                <TextField label="Your Phone Number" readOnly placeholder={this.state.profile.phoneNumber} />
                                <TextField label="Your Nationality" readOnly placeholder={this.state.profile.nationality} />
                                <TextField label="Your city of birth" readOnly placeholder={this.state.profile.cityOfBirth} />
                        <div style={{paddingLeft:'4.2vw', paddingTop:'3.5vh'}}>
                        <QRcode 
                                value= {"BEGIN:VCARD" +
                                "VERSION:4.0" +
                                "N:{profile.name}" +
                                "FN:"+ profile.name +
                                "TEL;TYPE#work,voice;VALUE#uri:tel:" + this.state.profile.phoneNumber +
                                "ADR;TYPE#HOME;LABEL#" + this.state.profile.nationality + "/" + this.state.profile.cityOfBirth +
                                "EMAIL:" + this.state.profile.email + "END:VCARD"}
                                />
                        </div>
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
                            <PrimaryButton text="Sign out" style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold ,width:'7vw'}} onClick={signout} />
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
                            text:(this.state.profile.name),
                            secondaryText: (this.state.profile.email),
                            imageUrl: (this.state.profile.imageURL)
                        }}
                        size={PersonaSize.size56}
                        imageAlt="Profile Image"
                    />
                </div>
                <div className="profile_edit_info">
                
                       
                        <MaskedTextField label="Phone number" mask="(99) 99999-9999" />
                       
                        <TextField
                            label="About you"
                            placeholder={(this.state.profile.about)}
                            multiline={this.state.multiline}
                            description="Max length is 512 characters"
                            onChange={this.state.handleChangeAbout}
                            onGetErrorMessage={this.state.getErrorMessageAbout}
                        />
                    
                        <TextField
                            label="Your nationality" 
                            placeholder={this.state.profile.nationality} 
                            description="Max length is 128 characters"
                            name = "nationality"
                            onChange={this.handleChange}
                            onGetErrorMessage={this.getErrorMessage}
                        />
                    
                        <TextField
                                label="Your city of birth" 
                                placeholder={this.state.profile.cityOfBirth} 
                                description="Max length is 128 characters"
                                name = "birthCity"
                                onChange={this.handleChange}
                                onGetErrorMessage={this.getErrorMessage}
                            />
    
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
 
       
}

export default Profile;