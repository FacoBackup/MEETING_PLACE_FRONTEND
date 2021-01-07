import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "./ProfileBarStyle.css";
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Dexie from "dexie";

class ProfileBar extends Component{
    constructor(){
        super()
        this.state={
            profile: {},
            // about: "",
            // nationality: '',
            // birthCity: '',
            // multiline: false,
            // editMode: false,
            // theme: getTheme()
        }
        this.handleChangeAbout = this.handleChangeAbout.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getErrorMessage = this.getErrorMessage.bind(this)
        this.getErrorMessageAbout = this.getErrorMessageAbout.bind(this)
        this.editProfileMode = this.editProfileMode.bind(this)
    }
    componentDidMount(){
        this.fetchData()
    }
    // handleChangeAbout(event){
    //     this.setState({
    //         about: event.target.value
    //     })   
    //     const newMultiline = this.state.about.length > 50;
    //     if (newMultiline !== this.state.multiline)
    //         this.toggleMultiline();
     
    // }
    // handleChange(event){
    //     this.setState({
    //         [event.target.name] : event.target.value
    //     })   
    // }
    fetchData = async() => {
        if(typeof this.state.cookies.get("JWT") !== 'undefined'){
            await axios({
                method: 'get',
                url: 'http://localhost:8080/api/user',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")}
            }).then(res=>{
                this.setState({
                    profile: res.data
                })
            })
            .catch()
        }         
    }

    signout = async() => {
        Object.keys(this.state.cookies.getAll()).forEach(name => this.state.cookies.remove(name))
        localStorage.clear()
        Dexie.delete('api_web_db')
    
        window.location.reload()
    }

    // editProfileMode(){
        
     
    //     this.setState({
    //         editMode: !this.state.editMode
    //     })
    
    // }

    // toggleMultiline(){
    //     this.setState({
    //         multiline: !this.state.multiline
    //     })
    // }
    // getErrorMessageAbout (value) {
    //     return value.length < 512 ? '' : `Input value must be less than 512 characters.`;
    // };    
    
    // getErrorMessage (value) {
    //     return value.length < 128 ? '' : `Input value must be less than 128 characters.`;
    // };

    // submitChanges = async() => {
    //     await axios({
    //         method: 'patch',
    //         url: 'http://localhost:8080/api/profile',
    //         headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
    //         data:{
    //             about : this.state.about,
    //             nationality : this.state.nationality,
    //             city: this.state.birthCity,
    //             name: null,
    //             imageURL: null
    //         }
    //     }).then(()=>{
    //         this.editProfileMode()
    //         this.fetchData()
    //     })
    //     .catch()
    
    // }

    render(){
        if(this.state.editMode === false){
            return(
                <div className="profile_container">
                   
                        <img className="profile_background_image" alt="BACKGROUD IMG"src= {(this.state.profile.imageURL === null) ?  this.state.profile.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU"}/>
                   
              
                    
                       
                                {/* <TextField label="About You" readOnly placeholder={this.state.profile.about} />
                                <TextField label="Your Phone Number" readOnly placeholder={this.state.profile.phoneNumber} />
                                <TextField label="Your Nationality" readOnly placeholder={this.state.profile.nationality} />
                                <TextField label="Your city of birth" readOnly placeholder={this.state.profile.cityOfBirth} />
                     */}
                        {/* <div  className="profile_qrcode_container">
                        <QRcode 
                                value= {"BEGIN:VCARD" +
                                "VERSION:4.0" +
                                "N:{profile.name}" +
                                "FN:"+ this.state.profile.name +
                                "TEL;TYPE#work,voice;VALUE#uri:tel:" + this.state.profile.phoneNumber +
                                "ADR;TYPE#HOME;LABEL#" + this.state.profile.nationality + "/" + this.state.profile.cityOfBirth +
                                "EMAIL:" + this.state.profile.email + "END:VCARD"}
                                />
                        </div> */}
                    
                    
                    <div className="profile_buttons_container">
                            <DefaultButton text="Home"  href='/' />
                            <DefaultButton text ="Followers"  href={"/followers/"+(new Cookies()).get("ID")}/>
                            <DefaultButton text ="Following" href={"/following/"+(new Cookies()).get("ID")}/>
                            <DefaultButton  text ="Search User"  href="/search_user"/>
                            <DefaultButton  text ="My Profile"  href={"/profile/"+(new Cookies()).get("ID")}/>
                            <DefaultButton  text ="Communities"  href="/communities"/>

                            {/* <DefaultButton  text ="Edit Profile"  onClick={this.editProfileMode}/> */}

                            
                            <PrimaryButton text="Sign out"  onClick={() => this.signout()} />
                    </div>
                    <div className="profile_card_container" >
                    
                        <Persona
                            {...{
                                imageUrl: (this.state.profile.imageURL === null) ?  this.state.profile.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                                text: this.state.profile.name,
                                secondaryText: this.state.profile.email
                            }}
                            size={PersonaSize.size48}
                            imageAlt="Conversation picture"
                        />
                        {/* <p style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold, gridRow:'1' , gridColumn:'1'}}>{this.state.profile.name}</p>
                        
                        <PrimaryButton text="Sign out" style={{ gridColumn:'2', width:'1%'}} onClick={this.signout} /> */}
                    </div>
                </div>
            );  
        }
        // else{
        //     return(
        //         <div className="profile_container">
        //         <div className="profile_background_image_container">
        //             <img style={{borderRadius:'8px', width:'17.5vw'}} alt="BACKGROUND IMG" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgICAgICAgHBwcHBwoHBwcHBw8ICQYKFREWFhURExMYHCggGBoxGxMTITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0ODg0NEisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKsBJwMBIgACEQEDEQH/xAAWAAEBAQAAAAAAAAAAAAAAAAAAAQb/xAAWEAEBAQAAAAAAAAAAAAAAAAAAgRH/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQcF/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzoDitUCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAIKgCoAAAAAKIAAAKgAAAAKAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z"/>
        //         </div>
        //         <div className="profile_persona_container"> 
        //             <Persona
        //                 {...{
        //                     text: this.state.profile.name,
        //                     secondaryText: this.state.profile.email,
        //                     imageUrl: this.state.profile.imageURL
        //                 }}
        //                 size={PersonaSize.size56}
        //                 imageAlt="Profile Image"
        //             />
        //         </div>
        //         <div className="profile_edit_info">
                
                       
        //                 <MaskedTextField label="Phone number" mask="(99) 99999-9999" />
                       
        //                 <TextField
        //                     label="About you"
        //                     placeholder={(this.state.profile.about)}
        //                     multiline={this.state.multiline}
        //                     description="Max length is 512 characters"
        //                     onChange={this.state.handleChangeAbout}
        //                     onGetErrorMessage={this.state.getErrorMessageAbout}
        //                 />
                    
        //                 <TextField
        //                     label="Your nationality" 
        //                     placeholder={this.state.profile.nationality} 
        //                     description="Max length is 128 characters"
        //                     name = "nationality"
        //                     onChange={this.handleChange}
        //                     onGetErrorMessage={this.getErrorMessage}
        //                 />
                    
        //                 <TextField
        //                         label="Your city of birth" 
        //                         placeholder={this.state.profile.cityOfBirth} 
        //                         description="Max length is 128 characters"
        //                         name = "birthCity"
        //                         onChange={this.handleChange}
        //                         onGetErrorMessage={this.getErrorMessage}
        //                     />
    
        //         </div>
        //         <div>
        //             <div className="profile_edit_info_buttons">
        //                 <DefaultButton text ="Cancel" style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold,width:'auto'}} onClick={this.editProfileMode}/>
        //                 <PrimaryButton text ="Save modifications" style={{ fontSize: FontSizes.size16, fontWeight: FontWeights.semibold,width:'auto', height:'auto' }} onClick={this.submitChanges}/>    
        //             </div>
                
        //         </div>
                
        //     </div>
        //     )
        // }
    }
 
       
}

export default ProfileBar;