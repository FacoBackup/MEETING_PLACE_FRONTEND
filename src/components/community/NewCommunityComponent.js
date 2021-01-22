import React from 'react';
import "../../style/universal/PageModel.css"
import "../../style/profile/DedicatedProfile.css"
import "../../style/universal/DedicatedPagesStyle.css"
import Conversations from "../../components/conversations/bar/ConversationBarComponent"
import axios from 'axios';
import SettingsIcon from '@material-ui/icons/Settings';
import ProfileBar from '../../components/profile/bar/ProfileBarComponent'
import Avatar from '@material-ui/core/Avatar'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import ListAltRoundedIcon from '@material-ui/icons/ListAltRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import HelpIcon from '@material-ui/icons/Help';
import TopicComponent from '../topics/TopicComponent'
import Host from '../../Host'
import CommunityUsersComponent from './users/CommunityUsersComponent'
import CommunityAboutComponent from './about/CommunityAboutComponent'
import CommunityRelatedComponent from './related/CommunityRelatedComponent'
import SubjectRoundedIcon from '@material-ui/icons/SubjectRounded';

class CommunityComponent extends React.Component {
    constructor(params) {
        super()
        this.state = {
            community: {},
            token: params.token,
            communityID: params.communityID,
            membersOption: false,
            all: false,
            mods: false,
            followers: false,
            topic: true,
            date: new Date(),
            related: false,
            about: false,
            dropdownSelectedOption: null
        }
    }

    componentDidMount() {
        this.fetchData()
    }


    async fetchData() {
        await axios({
            method: 'patch',
            url: Host() + 'api/get/community/by/id',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data: {
                communityID: this.state.communityID
            }
        }).then(res => {
            this.setState({
                community: res.data
            })
        })
            .catch(error => console.log(error))
    }


    optionSelect() {
        switch (true) {
            case this.state.related: {
                return (

                    <CommunityRelatedComponent communityID={this.state.communityID}/>

                )
            }

            case (this.state.membersOption): {

                return (

                    <CommunityUsersComponent token={this.state.token} role={this.state.community.role}
                                             communityID={this.state.communityID} options={1}/>

                )
            }
            case this.state.all: {

                return (

                    <CommunityUsersComponent token={this.state.token} role={this.state.community.role}
                                             communityID={this.state.communityID}/>

                )
            }
            case this.state.mods: {
                console.log("MODS")
                return (

                    <CommunityUsersComponent token={this.state.token} communityID={this.state.communityID} options={2}/>

                )
            }
            case this.state.followers: {

                return (

                    <CommunityUsersComponent token={this.state.token} communityID={this.state.communityID} options={0}/>

                )
            }
            case this.state.topic: {
                return (

                    <TopicComponent community={true} token={this.state.token} timeline={false}
                                    subjectID={this.state.communityID}/>

                )
            }
            case this.state.about: {
                return (

                    <CommunityAboutComponent community={this.state.community}/>

                )
            }
            default: {
                return (
                    <TopicComponent community={true} token={this.state.token} timeline={false}
                                    subjectID={this.state.communityID}/>
                )
            }
        }
    }


    render() {
        return (
            <div>

                <div className="profile_center_component">
                    <div className='profile_background_image_container'>
                        <img className='profile_background_image' alt="BACKGROUD"
                             src={(typeof this.state.community.backgroundImageURL !== 'undefined' && this.state.community.backgroundImageURL !== null) ? this.state.community.backgroundImageURL : "https://www.beautycolorcode.com/2f2f2f-1440x900.png"}/>
                    </div>
                    <div className="dedicated_component_container">

                        <div className="profile_content_container">
                            <div className='profile_container'>
                                <div style={{marginTop: '1vh', textAlign: 'center'}}>
                                    <Avatar
                                        style={{margin: 'auto', height: '85px', width: '85px'}}
                                        src={this.state.community.imageURL}
                                        alt="user"
                                    />
                                    <p style={{fontSize: '22px', fontWeight: '500'}}>{this.state.community.name}</p>
                                    <h4 style={{fontWeight: '500', color: '#aaadb1'}}>{this.state.community.email}</h4>
                                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <SubjectRoundedIcon/>
                                        {this.state.community.about}
                                    </div>
                                </div>
                                <div>
                                    <ButtonGroup size="large" variant="text">
                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px'}}
                                                color={this.state.topics === true ? "primary" : "default"}
                                                onClick={() => this.setState({
                                                    topics: true,
                                                    followers: false,
                                                    mods: false,
                                                    related: false,
                                                    membersOption: false,
                                                    all: false
                                                })}
                                        >Topics <p style={{color: '#aaadb1'}}>{this.state.community.topics}</p></Button>

                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px'}}
                                                color={this.state.followers === true ? "primary" : "default"}
                                                onClick={() => this.setState({
                                                    topics: false,
                                                    followers: true,
                                                    mods: false,
                                                    related: false,
                                                    membersOption: false,
                                                    all: false
                                                })}
                                        >Followers <p style={{color: '#aaadb1'}}>{this.state.community.followers}</p>
                                        </Button>

                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px'}}
                                                color={this.state.membersOption === true ? "primary" : "default"}
                                                onClick={() => this.setState({
                                                    topics: false,
                                                    followers: false,
                                                    mods: false,
                                                    related: false,
                                                    membersOption: true,
                                                    all: false
                                                })}
                                        >Members <p style={{color: '#aaadb1'}}>{this.state.community.members}</p>
                                        </Button>

                                        {/* <p style={{color:'#aaadb1'}}>{this.state.profile.following}</p> */}

                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px'}}
                                                color={this.state.mods === true ? "primary" : "default"}
                                                onClick={() => this.setState({
                                                    topics: false,
                                                    followers: false,
                                                    mods: true,
                                                    related: false,
                                                    membersOption: false,
                                                    all: false
                                                })}
                                        >Moderators <p style={{color: '#aaadb1'}}>{this.state.community.mods}</p>
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div className='options_container'>
                                <Button variant="outlined" style={{gridColumn: '1', gridRow: '1'}}
                                        className='option_content'
                                        onClick={() => this.setState({
                                            topics: false,
                                            followers: false,
                                            membersOption: false,
                                            mods: false,
                                            about: false,
                                            related: false,
                                            all: true
                                        })}
                                >

                                    <ListAltRoundedIcon style={{height: '33px', width: '33px', color: '#aaadb1'}}/>
                                    All Related Users
                                </Button>
                                <Button variant="outlined" disabled style={{gridColumn: '1', gridRow: '2'}}
                                        className='option_content'>

                                    <HelpIcon style={{height: '33px', width: '33px', color: '#aaadb1'}}/>
                                    help
                                </Button>
                                <Button variant={this.state.community === true ? "filled" : "outlined"} style={{
                                    gridColumn: '2',
                                    gridRow: '1',
                                    backgroundColor: (this.state.related === true ? "#303741" : 'transparent')
                                }} className='option_content'
                                        onClick={() => this.setState({
                                            topics: false,
                                            followers: false,
                                            membersOption: false,
                                            mods: false,
                                            about: false,
                                            related: true,
                                            all: false
                                        })}
                                >
                                    <PeopleAltRoundedIcon style={{height: '33px', width: '33px', color: '#aaadb1'}}/>
                                    RELATED Communities
                                </Button>
                                <Button variant="outlined" disabled style={{gridColumn: '2', gridRow: '2'}}
                                        className='option_content'>
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

export default CommunityComponent;