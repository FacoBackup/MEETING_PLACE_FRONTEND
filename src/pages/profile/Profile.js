import React from 'react';
import Cookies from 'universal-cookie';
import "../shared/styles/PageModel.css"
import "./styles/DedicatedProfile.css"
import "../shared/styles/DedicatedPagesStyle.css"
import Conversations from "../conversation/components/ConversationBarComponent"
import axios from 'axios';
import SettingsIcon from '@material-ui/icons/Settings';
import TopicComponent from '../topic/components/TopicComponent'
import AboutComponent from './components/options/UserAboutComponent'
import AboutProfileComponent from './components/options/UserAboutComponent'
import Followers from './components/followers/FollowersComponent'
import Following from './components/following/FollowingComponent'
import UserCommunitiesComponent from './components/options/UserCommunitiesComponent'
import Host from '../../Host'
import ProfileBar from './components/bar/ProfileBarComponent'
import Avatar from '@material-ui/core/Avatar'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import PhoneRoundedIcon from '@material-ui/icons/PhoneRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import HighlightIcon from '@material-ui/icons/Highlight';
import HelpIcon from '@material-ui/icons/Help';
import ProfileSettingsComponent from './components/options/ProfileSettingsComponent'
import Follow from '../shared/functions/social/FollowUser'
import Unfollow from '../shared/functions/social/UnfollowUser'
import TrendingComponent from "../topic/components/trending/TrendingComponent";

class Profile extends React.Component {
    isFollower;
    constructor({match}) {
        super({match})
        this.state = {
            userID: match.params.userID,
            token: (new Cookies()).get("JWT"),
            profile: {},
            topics: true,
            followers: false,
            following: false,
            community: false,
            aboutOption: false,
            settings: false
        }
    }

    componentDidMount() {
        this.fetchData().catch(r => console.log(r))
    }

    async fetchData() {
        try {
            await axios({
                method: 'patch',
                url: Host() + 'api/get/profile',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data: {
                    userID: this.state.userID
                }
            }).then(res => {

                this.setState({
                    profile: res.data
                })
            }).catch(error => console.log(error))
        } catch (error) {
            console.log(error)
        }
    }
    optionSelect() {
        switch (true) {
            case this.state.followers: {
                return (
                    <Followers userID={this.state.userID}/>
                )
            }
            case this.state.following: {
                return (
                    <Following userID={this.state.userID}/>
                )
            }
            case this.state.topics: {
                return (

                    <TopicComponent community={false} timeline={false} subjectID={this.state.userID} topics={true}
                                    token={(new Cookies()).get('JWT')}/>
                )
            }
            case this.state.aboutOption: {
                return (
                    <AboutComponent profile={this.state.profile}/>
                )
            }
            case this.state.community: {
                return (
                    <UserCommunitiesComponent token={(new Cookies()).get('JWT')} userID={this.state.userID}/>
                )
            }
            case this.state.settings: {
                if (this.state.userID === (new Cookies()).get("ID"))
                    return (
                        <ProfileSettingsComponent profile={this.state.profile}/>
                    )
                else
                    return (
                        <AboutProfileComponent/>
                    )
            }
            default: {
                return (
                    <TopicComponent community={false} timeline={false} subjectID={this.state.userID} topics={true}
                                    token={(new Cookies()).get('JWT')}/>

                )
            }
        }
    }
    unfollow(){

        Unfollow(this.state.profile.id).catch(r => console.log(r))
        window.location.reload()
    }
    follow(){

        Follow(this.state.profile.id).catch(r => console.log(r))
        window.location.reload()
    }
    render() {
        return (
            <div>
                <div className="profile_center_component">
                    <div className='profile_background_image_container'>
                        <img className='profile_background_image' alt="BACKGROUD"
                             src={(this.state.profile.backgroundImageURL !== null && typeof this.state.profile.backgroundImageURL !== 'undefined') ? this.state.profile.backgroundImageURL : "https://www.beautycolorcode.com/2f2f2f-1440x900.png"}/>
                    </div>
                    <div className="dedicated_component_container">

                        <div className="profile_content_container">
                            <div className='profile_container'>
                                <div style={{marginTop: '1vh', textAlign: 'center'}}>
                                    <Avatar
                                        style={{margin: 'auto', height: '4vw', width: '4vw', boxShadow:'0 0px 5px #23282e'}}
                                        src={this.state.profile.imageURL}
                                        alt="user"
                                    />
                                    <p style={{
                                        fontSize: '18px',
                                        fontWeight:'400',
                                        textTransform: 'capitalize'
                                    }}>{("" + this.state.profile.name)}</p>
                                    <p style={{fontSize: '17px',fontWeight: '350', color: '#888e97'}}>{this.state.profile.userName}</p>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#aaadb1'
                                    }}>
                                        <PhoneRoundedIcon style={{marginRight: '10px'}}/>
                                        {this.state.profile.phoneNumber}
                                    </div>
                                </div>
                                <div style={{margin:'auto'}}>
                                    <ButtonGroup size="large" variant="text">
                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px', width:'7.666666667vw',textTransform:'capitalize',color:(this.state.topics === true? "#39adf6": "#aaadb1")}}

                                                disableElevation
                                                onClick={() => this.setState({
                                                    topics: true,
                                                    followers: false,
                                                    following: false,
                                                    community: false,
                                                    settings: false
                                                })}
                                        >Topics <p style={{color: 'white'}}>{this.state.profile.topics}</p></Button>

                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px',width:'7.666666667vw',textTransform:'capitalize',color:(this.state.followers === true? "#39adf6": "#aaadb1")}}

                                                disableElevation
                                                onClick={() => this.setState({
                                                    topics: false,
                                                    followers: true,
                                                    following: false,
                                                    community: false,
                                                    settings: false
                                                })}
                                        >Followers <p style={{color: 'white'}}>{this.state.profile.followers}</p>
                                        </Button>

                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px',width:'7.666666667vw',textTransform:'capitalize',color:(this.state.following === true? "#39adf6": "#aaadb1")}}
                                                disableElevation
                                                onClick={() => this.setState({
                                                    topics: false,
                                                    followers: false,
                                                    following: true,
                                                    community: false,
                                                    settings: false
                                                })}
                                        >Following <p style={{color: 'white'}}>{this.state.profile.following}</p>
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div className='options_container'>
                                <Button variant="outlined" disabled style={{gridColumn: '1', gridRow: '1', textTransform:'capitalize',  display:'grid'}}
                                        className='option_content'>

                                    <HighlightIcon style={{height: '33px', width: '33px', color: '#aaadb1', margin:'auto'}}/>
                                    Highlights
                                </Button>
                                {parseInt((new Cookies()).get("ID")) !== this.state.profile.id?
                                    <Button
                                        disableElevation
                                        variant={"contained"}
                                        style={{backgroundColor: (!this.state.profile.isFollower ?"" : "red"),
                                            color:(!this.state.profile.isFollower ?"" : "white"),
                                            gridColumn: '1',
                                            gridRow: '2',
                                            textTransform:'capitalize',
                                        }}
                                        color={(!this.state.profile.isFollower ? "primary" : "")}
                                        className='option_content'
                                        onClick={() => (this.state.profile.isFollower? this.unfollow():this.follow())}>

                                        {this.state.profile.isFollower === true ? "UNFOLLOW" : "FOLLOW"}
                                    </Button>
                                    : <Button
                                            disableElevation
                                            disabled
                                            variant={"outlined"}
                                            style={{gridColumn: '1', gridRow: '2', textTransform:'capitalize',   display:'grid'}}
                                            className='option_content'
                                            >

                                                <HelpIcon style={{height: '33px', width: '33px', color: '#aaadb1', margin:'auto'}}/>
                                                help
                                        </Button>}

                                <Button variant={this.state.community === true ? "filled" : "outlined"} style={{
                                    gridColumn: '2',
                                    gridRow: '1',
                                    backgroundColor: (this.state.community === true ? "#303741" : 'transparent'),
                                    color:(this.state.community === true? "#39adf6": "white"),
                                    textTransform:'capitalize',
                                    display:'grid'

                                }} className='option_content'
                                        onClick={() => this.setState({
                                            topics: false,
                                            followers: false,
                                            following: false,
                                            community: true,
                                            settings: false
                                        })}
                                >
                                    <PeopleAltRoundedIcon style={{margin:'auto',height: '33px', width: '33px', color:(this.state.community === true? "#39adf6": "#aaadb1")}}/>
                                    {parseInt((new Cookies()).get("ID") )=== this.state.profile.id ? "Communities": "Communities"}
                                </Button>



                                <Button
                                    variant={this.state.settings === true ? "filled" : "outlined"}
                                    style={{
                                        gridColumn: '2',
                                        gridRow: '2',
                                        backgroundColor: (this.state.settings === true ? "#303741" : 'transparent'),
                                        color:(this.state.settings === true? "#39adf6": "white"),textTransform:'capitalize',
                                        display:'grid'

                                    }}
                                    className='option_content'
                                    onClick={() => this.setState({
                                        topics: false,
                                        followers: false,
                                        following: false,
                                        community: false,
                                        settings: true
                                    })}
                                >
                                    <SettingsIcon style={{height: '33px', width: '33px',color:(this.state.settings === true? "#39adf6": "#aaadb1"), margin:'auto'}}/>
                                    Settings
                                </Button>
                            </div>
                            <div>
                                {this.optionSelect()}
                            </div>
                        </div>

                    </div>
                </div>
                <div className="left_components">
                    <ProfileBar home={true}/>
                </div>
                <div className="right_components">
                    <Conversations/>
                    <TrendingComponent/>
                </div>
            </div>
        )
    }
}

export default Profile