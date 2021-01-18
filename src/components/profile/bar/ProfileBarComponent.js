import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../../style/profile/ProfileBarStyle.css";
import Button from '@material-ui/core/Button';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import Dexie from "dexie";
import Host from '../../../Host'
import { Avatar } from '@material-ui/core';
// import NavigationIcon from '@material-ui/icons/Navigation';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import LocationSearchingRoundedIcon from '@material-ui/icons/LocationSearchingRounded';
import StorageRoundedIcon from '@material-ui/icons/StorageRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });


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
                <ThemeProvider theme={theme}>
                <div className="profile_info_container">
                
                    <Avatar
                        style={{ height: '55px', width: '55px' }}
                        src = {this.state.profile.imageURL}
                        alt="user"
                       
                    />
                    <p style={{fontSize:'17px',fontWeight:'400'}}>Hi, {(""+this.state.profile.name).substr(0,(""+this.state.profile.name).indexOf(' '))}</p>
                    
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
                        <div className="profile_bar_buttons">
                           <SvgIcon>
                               <HomeRoundedIcon/>
                           </SvgIcon>
                           
                            <Button 
                            
                                color={this.state.timeline === true? "primary": 'default'}
                                disableElevation          
                                href={'/'}>Home</Button>
                        </div>
                        <div className="profile_bar_buttons">
                            <SvgIcon>
                               <LocationSearchingRoundedIcon />
                           </SvgIcon>
                            <Button  href={'/dashboard'}>EXPLORE</Button>
                        </div>
                        <div className="profile_bar_buttons">
                            <SvgIcon>
                               <StorageRoundedIcon/>
                           </SvgIcon>
                            <Button disabled>ARCHIVE</Button>
                        </div>
                        <div className="profile_bar_buttons">
                            <SvgIcon>
                               <PersonRoundedIcon/>
                           </SvgIcon>
                           
                            <Button 
                                color={this.state.home === true? "primary": 'default'}
                                href={'/profile/'+this.state.profile.email}>PROFILE</Button>
                        </div>
                        <div className="profile_bar_buttons">  
                            <SvgIcon>
                               <PeopleAltRoundedIcon/>
                           </SvgIcon>
                            <Button href={'/communities'}>COMMUNITIES</Button>
                        </div>
                        <div className="profile_bar_buttons">
                            <SvgIcon>
                               <NotificationsRoundedIcon/>
                           </SvgIcon>
                            <Button disabled>NOTIFICATIONS</Button>                        
                        </div>
                        <div className="profile_bar_buttons">
                            <SvgIcon>
                               <SearchRoundedIcon/>
                           </SvgIcon>
                           
                            <Button 
                                href="/search_user"
                                >search user</Button>
                        </div>
                        <div className="profile_bar_buttons">
                            <SvgIcon>
                               <ExitToAppRoundedIcon/>
                           </SvgIcon>
                           
                            <Button 
                            
                                onClick={() => this.signout()}>sign out</Button>
                        </div>
                       
                </div>
                </ThemeProvider>
              
            </div>
        );  
    }   
}

export default ProfileBarComponent;