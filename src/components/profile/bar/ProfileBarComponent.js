import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../../style/profile/ProfileBarStyle.css";
import Button from '@material-ui/core/Button';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import Dexie from "dexie";
import Host from '../../../Host'
import { Avatar, Badge, Modal } from '@material-ui/core';
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
import NotificationComponent from '../notification/NotificationComponent'
import {Redirect} from 'react-router-dom'
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
            notificationsQuantity: null,
            date: new Date(),
            notificationModal: false,
            signOut: false
        }
        this.renderNotificationModal = this.renderNotificationModal.bind(this)
    }
    
    componentDidMount(){
        this.fetchData()
        this.fetchNotifications()
        this.timerID = setInterval(
            () => this.tick(),
            1500
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.fetchNotifications()
        this.setState({
            date: new Date(),
        });
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

    async fetchNotifications(){
        try{
            if(typeof (new Cookies()).get("JWT") !== 'undefined'){
                await axios({
                    method: 'get',
                    url: Host()+'api/fetch/quantity/message/notifications',
                    headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")}
                }).then(res=>{
                    this.setState({
                        notificationsQuantity: res.data
                    })
                })
                .catch()
            }         
        }
        catch(error){
            console.log(error)
        }     
    }

    renderNotificationModal(){
        if(this.state.notificationModal === true)
            return(
                <Modal
                    style={{display:'grid', justifyContent:"center", alignContent:"center"}}
                    open={this.state.notificationModal === true}
                    onClose={() => this.setState({
                        notificationModal: false
                    })}
                >
                    <div className="notification_modal_container">
                        <NotificationComponent/>
                    </div>
                    
                </Modal>
            )
        else return null
    }
    render(){
        if(this.state.signOut === false)
            return(
                <div className="profile_bar_container">
                    <ThemeProvider theme={theme}>
                    <this.renderNotificationModal/>
                    <div className="profile_info_container">
                    
                        <Avatar
                            style={{ height: '55px', width: '55px' }}
                            src = {this.state.profile.imageURL}
                            alt="user"
                        
                        />
                        <p style={{marginLeft:'5px',fontSize:'17px',fontWeight:'400', textTransform:'capitalize'}}>Hi, {(""+this.state.profile.name).substr(0,(""+this.state.profile.name).indexOf(' '))}</p>
                        
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
                                    style={{textTransform:'capitalize', fontSize: '17px', fontWeight: '500'}}
                                    color={this.state.timeline === true? "primary": 'default'}
                                    disableElevation          
                                    href={'/'}>home</Button>
                            </div>
                            <div className="profile_bar_buttons">
                                <SvgIcon>
                                <LocationSearchingRoundedIcon />
                            </SvgIcon>
                                <Button  style={{textTransform:'capitalize', fontSize: '17px', fontWeight: '500'}} href={'/dashboard'}>explore</Button>
                            </div>
                            <div className="profile_bar_buttons">
                                <SvgIcon>
                                <StorageRoundedIcon/>
                            </SvgIcon>
                                <Button style={{textTransform:'capitalize', fontSize: '17px', fontWeight: '500'}} disabled>archive</Button>
                            </div>
                            <div className="profile_bar_buttons">
                                <SvgIcon>
                                <PersonRoundedIcon/>
                            </SvgIcon>
                            
                                <Button 
                                style={{textTransform:'capitalize', fontSize: '17px', fontWeight: '500'}}
                                    color={this.state.home === true? "primary": 'default'}
                                    href={'/profile/'+this.state.profile.email}>profile</Button>
                            </div>
                            <div className="profile_bar_buttons">  
                                <SvgIcon>
                                <PeopleAltRoundedIcon/>
                            </SvgIcon>
                                <Button style={{textTransform:'capitalize', fontSize: '17px', fontWeight: '500'}} href={'/communities'}>communities</Button>
                            </div>
                            <div className="profile_bar_buttons">
                                <Badge color="secondary" badgeContent={this.state.notificationsQuantity}>
                                <NotificationsRoundedIcon/>
                            </Badge>
                                <Button style={{textTransform:'capitalize', fontSize: '17px', fontWeight: '500'}} onClick={() => this.setState({
                                    notificationModal: true
                                })}>notifications</Button>                        
                            </div>
                            <div className="profile_bar_buttons">
                                <SvgIcon>
                                <SearchRoundedIcon/>
                            </SvgIcon>
                            
                                <Button 
                                    style={{textTransform:'capitalize', fontSize: '17px', fontWeight: '500'}}
                                    href="/search_user"
                                    >search</Button>
                            </div>
                            <div className="profile_bar_buttons">
                                <SvgIcon>
                                <ExitToAppRoundedIcon/>
                            </SvgIcon>
                            
                                <Button 
                                    style={{textTransform:'capitalize', fontSize: '17px', fontWeight: '500'}}
                                    onClick={() => this.setState({
                                        signOut: true
                                    })}>sign out</Button>
                            </div>
                        
                    </div>
                    </ThemeProvider>
                
                </div>
            );  
        else
            return(<Redirect to="/authenticate"/>)
    }   
}

export default ProfileBarComponent;