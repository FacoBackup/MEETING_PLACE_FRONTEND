import React from 'react';
import Cookies from 'universal-cookie';
import "../../style/universal/PageModel.css"
import "../../style/profile/DedicatedProfile.css"
import "../../style/universal/DedicatedPagesStyle.css"
import Conversations from "../../components/conversations/bar/ConversationBarComponent"
import axios from 'axios';
import SettingsIcon from '@material-ui/icons/Settings';
import TopicComponent from '../../components/topics/TopicComponent'
import AboutComponent from '../../components/profile/options/UserAboutComponent'
import AboutProfileComponent from '../../components/profile/options/UserAboutComponent'
import Followers from '../../components/social/followers/FollowersComponent'
import Following from '../../components/social/following/FollowingComponent'
import UserCommunitiesComponent from '../../components/profile/options/UserCommunitiesComponent'
import Host from '../../Host'
import ProfileBar from '../../components/profile/bar/ProfileBarComponent'
import Avatar from '@material-ui/core/Avatar'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import PhoneRoundedIcon from '@material-ui/icons/PhoneRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import HighlightIcon from '@material-ui/icons/Highlight';
import HelpIcon from '@material-ui/icons/Help';
import ProfileSettingsComponent from '../../components/profile/options/ProfileSettingsComponent'
import Follow from '../../functions/social/FollowUser'
import Unfollow from '../../functions/social/UnfollowUser'
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";


const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

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
                                        style={{margin: 'auto', height: '4vw', width: '4vw'}}
                                        src={this.state.profile.imageURL}
                                        alt="user"
                                    />
                                    <p style={{
                                        fontSize: '22px',
                                        fontWeight: '500',
                                        textTransform: 'capitalize'
                                    }}>{("" + this.state.profile.name)}</p>
                                    <h4 style={{fontWeight: '500', color: '#aaadb1'}}>{this.state.profile.userName}</h4>
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
                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px', width:'7.666666667vw'}}
                                                color={this.state.topics === true ? "primary" : "default"}
                                                onClick={() => this.setState({
                                                    topics: true,
                                                    followers: false,
                                                    following: false,
                                                    community: false,
                                                    settings: false
                                                })}
                                        >Topics <p style={{color: '#aaadb1'}}>{this.state.profile.topics}</p></Button>

                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px',width:'7.666666667vw'}}
                                                color={this.state.followers === true ? "primary" : "default"}
                                                onClick={() => this.setState({
                                                    topics: false,
                                                    followers: true,
                                                    following: false,
                                                    community: false,
                                                    settings: false
                                                })}
                                        >Followers <p style={{color: '#aaadb1'}}>{this.state.profile.followers}</p>
                                        </Button>

                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px',width:'7.666666667vw'}}
                                                color={this.state.following === true ? "primary" : "default"}
                                                onClick={() => this.setState({
                                                    topics: false,
                                                    followers: false,
                                                    following: true,
                                                    community: false,
                                                    settings: false
                                                })}
                                        >Following <p style={{color: '#aaadb1'}}>{this.state.profile.following}</p>
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div className='options_container'>
                                <Button variant="outlined" disabled style={{gridColumn: '1', gridRow: '1'}}
                                        className='option_content'>

                                    <HighlightIcon style={{height: '33px', width: '33px', color: '#aaadb1'}}/>
                                    Highlights
                                </Button>
                                {parseInt((new Cookies()).get("ID")) !== this.state.profile.id?
                                    <Button
                                        disableElevation
                                        variant={"contained"}
                                        style={{backgroundColor: (!this.state.profile.isFollower ?"" : "red"),
                                            color:(!this.state.profile.isFollower ?"" : "white"),
                                            gridColumn: '1',
                                            gridRow: '2'}}
                                        color={(!this.state.profile.isFollower ? "primary" : "")}
                                        className='option_content'
                                        onClick={() => (this.state.profile.isFollower? this.unfollow():this.follow())}>

                                        {this.state.profile.isFollower === true ? "UNFOLLOW" : "FOLLOW"}
                                    </Button>
                                    : <Button
                                            disableElevation
                                            disabled
                                            variant={"outlined"}
                                            style={{gridColumn: '1', gridRow: '2'}}
                                            className='option_content'
                                            >
                                            <div style={{display:'flex', alignContent:'center', alignItems:'center'}}>
                                                <HelpIcon style={{height: '33px', width: '33px', color: '#aaadb1'}}/>
                                                help
                                            </div>
                                        </Button>}

                                <Button variant={this.state.community === true ? "filled" : "outlined"} style={{
                                    gridColumn: '2',
                                    gridRow: '1',
                                    backgroundColor: (this.state.community === true ? "#303741" : 'transparent')
                                }} className='option_content'
                                        onClick={() => this.setState({
                                            topics: false,
                                            followers: false,
                                            following: false,
                                            community: true,
                                            settings: false
                                        })}
                                >
                                    <PeopleAltRoundedIcon style={{height: '33px', width: '33px', color: '#aaadb1'}}/>
                                    {parseInt((new Cookies()).get("ID") )=== this.state.profile.id ? "Communities": "Communities"}
                                </Button>



                                <Button
                                    variant={this.state.settings === true ? "filled" : "outlined"}
                                    style={{
                                        gridColumn: '2',
                                        gridRow: '2',
                                        backgroundColor: (this.state.settings === true ? "#303741" : 'transparent')
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
                                    <SettingsIcon style={{height: '33px', width: '33px', color: '#aaadb1'}}/>
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
                </div>
            </div>
        )
    }
}

export default Profile