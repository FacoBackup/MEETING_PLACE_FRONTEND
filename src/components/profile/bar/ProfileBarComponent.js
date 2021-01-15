import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../../style/profile/ProfileBarStyle.css";
import Button from '@material-ui/core/Button';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Dexie from "dexie";
import Host from '../../../Host'
import { Avatar, Fab } from '@material-ui/core';
// import NavigationIcon from '@material-ui/icons/Navigation';
// import SvgIcon from '@material-ui/core/SvgIcon';

class ProfileBarComponent extends Component{
    constructor(params){
        super()
        this.state={
            profile: {},
            followers: params.followers,
            following: params.following,
            communities: params.communities,
            home: params.home,
            about: params.about,
            conversation: params.conversation,
            topics: params.topics,
            external: params.external,
            search: params.search,
            timeline: params.timeline,
            communityOptions: params.communityOptions,
            more: false,
        }
    }
    componentDidMount(){
        this.fetchData()
    }

    async fetchData(){
        try{
            if(typeof (new Cookies()).get("JWT") !== 'undefined'){
                await axios({
                    method: 'get',
                    url: Host()+'api/user',
                    headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")}
                }).then(res=>{
                    this.setState({
                        profile: res.data
                    })
                })
                .catch()
            }         
        }
        catch(error){
            console.log(error)
        }
        
            
    }

    async signout() {
        Object.keys((new Cookies()).getAll()).forEach(name => (new Cookies()).remove(name))
        localStorage.clear()
        await Dexie.delete('api_web_db')
    
        window.location.reload()
    }

    render(){
        
        return(
            <div className="profile_bar_container">
                 <div className="personas_container" style={{marginBottom: '85%', marginTop:'5%', width:'80%'}}>
                
                    <Avatar
                        src = {this.state.profile.imageURL}
                        alt="user"
                    />
                    <p>{this.state.profile.name}</p>
                    
                    </div>
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
                
                
                <div className="profile_bar_buttons_container">
                        {/* {this.state.timeline === true? <PrimaryButton iconProps={this.state.addIcon}  text ="Home"/>:<DefaultButton text ="Home" iconProps={this.state.addIcon} href='/'/>}  */}
                        {/* {this.state.timeline === true? <PrimaryButton iconProps={this.state.addIcon}  text ="Home"/>:<DefaultButton text ="Home" iconProps={this.state.addIcon} href='/'/>} 
                        {this.state.followers === true? <PrimaryButton text ="Followers"/>:<DefaultButton text ="Followers"  href={'/profile/'+this.state.profile.email+'/2'}/>} 
                        {this.state.following === true? <PrimaryButton text ="Following"/>:<DefaultButton text ="Following"  href={'/profile/'+this.state.profile.email+'/1'}/>} 
                        {this.state.search === true? <PrimaryButton text ="Search User"/>:<DefaultButton text ="Search User"  href='/search_user'/>} 
                        {this.state.topics === true? <PrimaryButton text ="My Topics"/>:<DefaultButton text ="My Topics"  href={'/profile/'+this.state.profile.email+'/0'}/>} 
                        {this.state.communities === true? <PrimaryButton text ="Communities"/>:<DefaultButton text ="Communities"  href={'/profile/'+this.state.profile.email+'/3'}/>} 
                        {this.state.communityOptions === true? <PrimaryButton text ="Community Options"/>:<DefaultButton text ="Community Options"  href={'/communities'}/>} 
                        {this.state.about === true? <PrimaryButton text ="About Me"/>:<DefaultButton text ="About Me"  href={'/profile/'+this.state.profile.email+'/4'}/>} 
                        <DefaultButton text="Sign out"  onClick={() => this.signout()} />                     */}
                        <Button style={{color:'white', fontSize:'15px', fontWeight:"bold"}} href={'/'}>Timeline</Button>
                        <Button style={{color:'white', fontSize:'15px', fontWeight:"bold"}} href={'/dashboard'}>EXPLORE</Button>
                        
                        <Button style={{color:'white', fontSize:'15px', fontWeight:"bold"}} href={'/profile/'+this.state.profile.email+'/0'}>ARCHIVE</Button>
                        <Button style={{color:'white', fontSize:'15px', fontWeight:"bold"}} href={'/profile/'+this.state.profile.email+'/0'}>PROFILE</Button>
                        <Button style={{color:'white', fontSize:'15px', fontWeight:"bold"}} href={'/profile/'+this.state.profile.email+'/0'}>COMMUNITIES</Button>
                        <Button style={{color:'white', fontSize:'15px', fontWeight:"bold"}} href={'/profile/'+this.state.profile.email+'/0'}>NOTIFICATIONS</Button>

                        {/* <DefaultButton  text ="Communities"  href="/communities"/>         */}
                        
                </div>
               
              
            </div>
        );  
    }   
}

export default ProfileBarComponent;