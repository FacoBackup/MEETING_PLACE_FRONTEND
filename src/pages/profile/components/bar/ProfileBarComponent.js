import React, {Component} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import "../../styles/ProfileBarStyle.css";
import Button from '@material-ui/core/Button';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import GroupAddRoundedIcon from '@material-ui/icons/GroupAddRounded';
import Host from '../../../../Host'
import {Avatar, Modal} from '@material-ui/core';
import {ThemeProvider} from "@material-ui/styles";
import {createMuiTheme} from "@material-ui/core/styles";
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import CompassRounded from '@material-ui/icons/ExploreRounded';
import StorageRoundedIcon from '@material-ui/icons/StorageRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import NotificationComponent from '../notification/NotificationComponent'
import {Redirect} from 'react-router-dom'
import CommunityCreationComponent from "../../../community/component/creation/CommunityCreationComponent";

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

const cookies = new Cookies()

class ProfileBarComponent extends Component {
    constructor(params) {
        super(params)
        this.state = {
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
            signOut: false,
            communityCreationModal:false
        }
        this.renderCommunityCreationModal = this.renderCommunityCreationModal.bind(this)
        this.renderNotificationModal = this.renderNotificationModal.bind(this)
    }

    componentDidMount() {

        this.fetchData().catch(r => console.log(r))
        this.fetchNotifications().catch(r => console.log(r))
        this.timerID = setInterval(
            () => this.tick(),
            1500
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.fetchNotifications().catch(r => console.log(r))
        this.setState({
            date: new Date(),
        });
    }

    async fetchData() {
        try {
            if (typeof (cookies).get("JWT") !== 'undefined') {
                await axios({
                    method: 'get',
                    url: Host() + 'api/user',
                    headers: {"Authorization": 'Bearer ' + (cookies).get("JWT")}
                }).then(res => {
                    console.log(res.data)
                    this.setState({
                        profile: res.data
                    })
                }).catch(e => console.log(e))
            }
        } catch (error) {
            console.log(error)
        }
    }

    async fetchNotifications() {
        try {
            if (typeof (cookies).get("JWT") !== 'undefined') {
                await axios({
                    method: 'get',
                    url: Host() + 'api/fetch/quantity/message/notifications',
                    headers: {"Authorization": 'Bearer ' + (cookies).get("JWT")}
                }).then(res => {
                    this.setState({
                        notificationsQuantity: res.data
                    })
                })
                    .catch()
            }
        } catch (error) {
            console.log(error)
        }
    }

    renderNotificationModal() {
        if (this.state.notificationModal === true)
            return (
                <Modal
                    style={{display: 'grid', justifyContent: "center", alignContent: "center"}}
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
    renderCommunityCreationModal() {
        if (this.state.communityCreationModal === true)
            return (
                <Modal
                    style={{display: 'grid', justifyContent: "center", alignContent: "center"}}
                    open={this.state.communityCreationModal === true}
                    onClose={() => this.setState({
                        communityCreationModal: false
                    })}
                >
                    <div className="community_modal_container">
                        <CommunityCreationComponent/>
                    </div>

                </Modal>
            )
        else return null
    }
    render() {
        if (this.state.signOut === false)
            return (

                <div className="profile_bar_container">
                    <ThemeProvider theme={theme}>
                        <this.renderNotificationModal/>
                        <this.renderCommunityCreationModal/>
                        <div className="profile_info_container">

                            <Avatar
                                style={{height: '55px', width: '55px'}}
                                src={this.state.profile.imageURL}
                                alt="user"

                            />
                            <p style={{
                                marginLeft: '5px',
                                fontSize: '17px',
                                fontWeight: '400',
                                lineBreak:'auto',
                                wordBreak:'break-all',
                                textTransform: 'capitalize'
                            }}>Hi, {("" + this.state.profile.name).substr(0, ("" + this.state.profile.name).indexOf(' '))}</p>

                        </div>
                        {/* <div  className="profile_qrcode_container">
                        <QRcode 
                                value= {"BEGIN:VCARD" +
                                "VERSION:4.0" +
                                "N:{components.name}" +
                                "FN:"+ this.state.components.name +
                                "TEL;TYPE#work,voice;VALUE#uri:tel:" + this.state.components.phoneNumber +
                                "ADR;TYPE#HOME;LABEL#" + this.state.components.nationality + "/" + this.state.components.cityOfBirth +
                                "EMAIL:" + this.state.components.email + "END:VCARD"}
                                />
                        </div> */}


                        <div className="profile_bar_buttons_container">
                            <div className={this.state.timeline === true ? "clicked_button_style" : null} >
                                <Button href={"/home"} style={{textTransform:"capitalize",   color:(this.state.timeline === true ? "#39adf6":'#ededed'),fontSize:'16px', width:'14vw',marginLeft:'1vw', justifyContent:'flex-start'}}>
                                    <HomeRoundedIcon style={{marginRight:'10px', fontSize:'27px',color:(this.state.timeline === true ? "#39adf6":'#62666f')}}/> home</Button>
                            </div>

                            <div className={this.state.external === true ? "clicked_button_style" : null} >
                                <Button disabled style={{textTransform:"capitalize",  color:(this.state.external === true ? "#39adf6":'#ededed'),fontSize:'16px', width:'14vw',marginLeft:'1vw', justifyContent:'flex-start'}}>
                                    <CompassRounded style={{marginRight:'10px', fontSize:'27px',color:(this.state.external === true ? "#39adf6":'#62666f')}}/>explore</Button>
                            </div>

                            <div className={this.state.archive === true ? "clicked_button_style" : null} >
                                <Button disabled style={{textTransform:"capitalize",  color:(this.state.archive === true ? "#39adf6":'#ededed'),fontSize:'16px', width:'14vw',marginLeft:'1vw', justifyContent:'flex-start'}}>
                                    <StorageRoundedIcon style={{marginRight:'10px', fontSize:'27px',color:'#62666f'}}/>archive</Button>
                            </div>
                            <div className={this.state.home === true ? "clicked_button_style" : null} >
                                <Button style={{textTransform:"capitalize", color:(this.state.home === true ? "#39adf6":'#ededed'),fontSize:'16px', width:'14vw',marginLeft:'1vw', justifyContent:'flex-start'}} href={"/profile/"+this.state.profile.id}>
                                    <PersonRoundedIcon style={{marginRight:'10px', fontSize:'27px',color:(this.state.home === true ? "#39adf6":'#62666f')}}/>profile
                                </Button>
                            </div>
                            <div className={this.state.communityCreationModal === true ? "clicked_button_style" : null} >
                                <Button  style={{color:('#ededed'),textTransform:"capitalize", fontSize:'16px', width:'14vw',marginLeft:'1vw', justifyContent:'flex-start'}} onClick={() => this.setState({
                                    communityCreationModal: true
                                })}> <GroupAddRoundedIcon style={{marginRight:'10px', fontSize:'27px',color:('#62666f')}}/>create community</Button>
                            </div>

                            <div className={this.state.notificationModal === true ? "clicked_button_style" : null} >
                                <Button  style={{textTransform:"capitalize",  color:('#ededed'),fontSize:'16px', width:'14vw',marginLeft:'1vw', justifyContent:'flex-start'}} onClick={() => this.setState({
                                    notificationModal: true
                                })}> <NotificationsRoundedIcon style={{marginRight:'10px', fontSize:'27px',color:('#62666f')}}/>notifications</Button>
                            </div>
                            <div className={this.state.search === true ? "clicked_button_style" : null} >
                                <Button style={{textTransform:"capitalize",  color:(this.state.search === true ? "#39adf6":'#ededed'),fontSize:'16px', width:'14vw',marginLeft:'1vw', justifyContent:'flex-start'}} href="/search_user">
                                    <SearchRoundedIcon style={{marginRight:'10px', fontSize:'27px',color:(this.state.search === true ? "#39adf6":'#62666f'),}}/>search
                                </Button>
                            </div>
                            <div >
                                <Button href={"/authenticate"} style={{textTransform:"capitalize",  color:'#ededed',fontSize:'16px', width:'14vw',marginLeft:'1vw', justifyContent:'flex-start'}}> <ExitToAppRoundedIcon style={{marginRight:'10px', fontSize:'27px',color:'#62666f'}}/>sign out</Button>
                            </div>


                        </div>
                    </ThemeProvider>

                </div>
            );
        else
            return (<Redirect to="/authenticate"/>)
    }
}

export default ProfileBarComponent;