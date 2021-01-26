import React from 'react';
import "../../shared/styles/PageModel.css"
import "../../profile/styles/DedicatedProfile.css"
import "../../shared/styles/DedicatedPagesStyle.css"
import Conversations from "../../conversation/components/ConversationBarComponent"
import axios from 'axios';
import SettingsIcon from '@material-ui/icons/Settings';
import ProfileBar from '../../profile/components/bar/ProfileBarComponent'
import Avatar from '@material-ui/core/Avatar'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import ListAltRoundedIcon from '@material-ui/icons/ListAltRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import HelpIcon from '@material-ui/icons/Help';
import TopicComponent from '../../topic/components/TopicComponent'
import Host from '../../../Host'
import CommunityUsersComponent from './users/CommunityUsersComponent'
import CommunityAboutComponent from './about/CommunityAboutComponent'
import CommunityRelatedComponent from './related/CommunityRelatedComponent'
import SubjectRoundedIcon from '@material-ui/icons/SubjectRounded';
import CommunitySettingsComponent from "./settings/CommunitySettingsComponent";
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
            settings: false,
            dropdownSelectedOption: null
        }
    }

    componentDidMount() {
        this.fetchData().catch(e => console.log(e))
    }


    async fetchData() {
      try{
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
      }catch (e) {
          console.log(e)
      }

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
                return (

                    <CommunityUsersComponent token={this.state.token} communityID={this.state.communityID} options={2}/>

                )
            }
            case this.state.followers: {

                return (

                    <CommunityUsersComponent token={this.state.token} communityID={this.state.communityID} options={0}/>

                )
            }
            case this.state.settings:{
                console.log('here')
                return(
                    <CommunitySettingsComponent community={this.state.community}/>
                )
            }
            case this.state.topic: {
                return (

                    <TopicComponent community={true} token={this.state.token} timeline={false}
                                    subjectID={this.state.communityID}/>

                )
            }

            // case this.state.about: {
            //     return (
            //
            //         <CommunityAboutComponent community={this.state.community}/>
            //
            //     )
            // }

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
                                        style={{margin: 'auto', height: '4vw', width: '4vw'}}
                                        src={this.state.community.imageURL}
                                        alt="community"
                                    />
                                    <p style={{fontSize: '18px', fontWeight: '400', textTransform:'capitalize'}}>{this.state.community.name}</p>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#aaadb1'
                                    }}>
                                        <SubjectRoundedIcon/>
                                        {this.state.community.about}
                                    </div>
                                </div>
                                <div>
                                    <ButtonGroup size="medium" variant="text">
                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px', width:'5vw',textTransform:'capitalize',color:(this.state.topics === true? "#39adf6": "#aaadb1")}}
                                                color={this.state.topics === true ? "primary" : "default"}
                                                onClick={() => this.setState({
                                                    topics: true,
                                                    followers: false,
                                                    mods: false,
                                                    related: false,
                                                    membersOption: false,
                                                    all: false,
                                                    settings:false
                                                })}
                                        >Topics <p style={{color: 'white'}}>{this.state.community.topics}</p></Button>

                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px', width:'5vw',textTransform:'capitalize',color:(this.state.followers === true? "#39adf6": "#aaadb1")}}
                                                color={this.state.followers === true ? "primary" : "default"}
                                                onClick={() => this.setState({
                                                    topics: false,
                                                    followers: true,
                                                    mods: false,
                                                    related: false,
                                                    membersOption: false,
                                                    all: false,
                                                    settings:false
                                                })}
                                        >Followers <p style={{color: 'white'}}>{this.state.community.followers}</p>
                                        </Button>

                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px', width:'5vw',textTransform:'capitalize',color:(this.state.membersOption === true? "#39adf6": "#aaadb1")}}
                                                color={this.state.membersOption === true ? "primary" : "default"}
                                                onClick={() => this.setState({
                                                    topics: false,
                                                    followers: false,
                                                    mods: false,
                                                    related: false,
                                                    membersOption: true,
                                                    all: false,
                                                    settings:false
                                                })}
                                        >Members <p style={{color: 'white'}}>{this.state.community.members}</p>
                                        </Button>


                                        <Button style={{display: 'grid', lineHeight: '7px', fontSize: '15px', width:'5vw',textTransform:'capitalize',color:(this.state.mods === true? "#39adf6": "#aaadb1")}}
                                                onClick={() => this.setState({
                                                    topics: false,
                                                    followers: false,
                                                    mods: true,
                                                    related: false,
                                                    membersOption: false,
                                                    all: false,
                                                    settings:false
                                                })}
                                        >Mods <p style={{color: 'white'}}>{this.state.community.mods}</p>
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div className='options_container'>
                                <Button variant="outlined" style={{gridColumn: '1', gridRow: '1', textTransform:'capitalize',  display:'grid',color:(this.state.all === true? "#39adf6": "white"), backgroundColor:(this.state.all === true ? "#303741" : 'transparent')}}
                                        className='option_content'
                                        onClick={() => this.setState({
                                            topics: false,
                                            followers: false,
                                            membersOption: false,
                                            mods: false,
                                            about: false,
                                            related: false,
                                            all: true,
                                            settings:false
                                        })}
                                >

                                    <ListAltRoundedIcon style={{height: '33px', width: '33px',  color:(this.state.all === true? "#39adf6": "#aaadb1"), margin:'auto'}}/>
                                    All Related Users
                                </Button>
                                <Button variant="outlined" disabled style={{gridColumn: '1', gridRow: '2',textTransform:'capitalize',  display:'grid'}}
                                        className='option_content'>

                                    <HelpIcon style={{height: '33px', width: '33px',  color:(this.state.community === true? "#39adf6": "#aaadb1"), margin:'auto'}}/>
                                    help
                                </Button>
                                <Button variant={"outlined"} style={{
                                    gridColumn: '2',
                                    gridRow: '1',
                                    textTransform:'capitalize',
                                    display:'grid',
                                    backgroundColor: (this.state.related === true ? "#303741" : 'transparent'),
                                    color:(this.state.related === true? "#39adf6": "white")
                                }} className='option_content'
                                        onClick={() => this.setState({
                                            topics: false,
                                            followers: false,
                                            membersOption: false,
                                            mods: false,
                                            about: false,
                                            related: true,
                                            all: false,
                                            settings:false
                                        })}
                                >
                                    <PeopleAltRoundedIcon style={{height: '33px', width: '33px', color:(this.state.related === true? "#39adf6": "#aaadb1"), margin:'auto'}}/>
                                    related Communities
                                </Button>
                                {this.state.community.role === "MODERATOR" ?
                                    <Button variant={ "outlined"} style={{ backgroundColor: (this.state.settings === true ? "#303741" : 'transparent'),gridColumn: '2', gridRow: '2',textTransform:'capitalize',  display:'grid', color:(this.state.settings === true? "#39adf6": "white")}}
                                            className='option_content'
                                            onClick={() =>
                                                this.setState({
                                                  topics: false,
                                                  followers: false,
                                                  membersOption: false,
                                                  mods: false,
                                                  about: false,
                                                  related: false,
                                                  all: false,
                                                  settings:true
                                  })}
                                    >

                                    <SettingsIcon style={{height: '33px', width: '33px',  color:(this.state.settings === true? "#39adf6": "#aaadb1"), margin:'auto'}}/>
                                    Settings
                                </Button>: null}

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