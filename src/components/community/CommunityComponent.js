import React from 'react'
import axios from 'axios';
import TopicComponent from '../topics/TopicComponent'
import {DefaultButton, PrimaryButton} from 'office-ui-fabric-react';
import {Persona, PersonaSize} from 'office-ui-fabric-react/lib/Persona';
import Host from '../../Host'
import "../../style/universal/DedicatedPagesStyle.css"
import CommunityUsersComponent from './users/CommunityUsersComponent'
import CommunityAboutComponent from './about/CommunityAboutComponent'
import CommunityRelatedComponent from './related/CommunityRelatedComponent'
import {Dropdown} from 'office-ui-fabric-react/lib/Dropdown';

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


    renderOptions() {
        switch (true) {
            case this.state.related: {
                return (
                    <div>
                        <CommunityRelatedComponent communityID={this.state.communityID}/>
                    </div>
                )
            }

            case (this.state.membersOption): {
                console.log("MEMBERS")
                return (
                    <div>
                        <CommunityUsersComponent token={this.state.token} role={this.state.community.role}
                                                 communityID={this.state.communityID} options={1}/>
                    </div>
                )
            }
            case this.state.all: {
                console.log("ALL")
                return (
                    <div>
                        <CommunityUsersComponent token={this.state.token} role={this.state.community.role}
                                                 communityID={this.state.communityID}/>
                    </div>
                )
            }
            case this.state.mods: {
                console.log("MODS")
                return (
                    <div>
                        <CommunityUsersComponent token={this.state.token} communityID={this.state.communityID}
                                                 options={2}/>
                    </div>
                )
            }
            case this.state.followers: {
                console.log("FOLLOWERS")
                return (
                    <div>
                        <CommunityUsersComponent token={this.state.token} communityID={this.state.communityID}
                                                 options={0}/>
                    </div>
                )
            }
            case this.state.topic: {
                return (
                    <div>
                        <TopicComponent community={true} token={this.state.token} timeline={false}
                                        subjectID={this.state.communityID}/>
                    </div>
                )
            }
            case this.state.about: {
                return (
                    <div>
                        <CommunityAboutComponent community={this.state.community}/>
                    </div>
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
        if (typeof this.state.community.name !== 'undefined') {
            return (
                <div className="dedicated_component_container">
                    <div className="dedicated_image_container">
                        <img className='dedicated_image_style' alt="BACKGROUD"
                             src={(this.state.community.backgroundImageURL !== null && typeof this.state.community.backgroundImageURL !== 'undefined') ? this.state.community.backgroundImageURL : "https://www.beautycolorcode.com/2f2f2f-1440x900.png"}/>

                    </div>
                    <div className="dedicated_action_bar">
                        <Persona
                            {...{
                                imageUrl: this.state.community.imageURL,
                                text: this.state.community.name,
                                secondaryText: this.state.community.about,
                                tertiaryText: "Your're a " + this.state.community.role + " here"
                            }}
                            size={PersonaSize.size72}
                            imageAlt="Community"
                        />
                        <div className="dedicated_action_bar_buttons">

                            {this.state.topic === true ? <PrimaryButton style={{fontSize: '16px'}} text='Topics'/> :
                                <DefaultButton style={{fontSize: '16px'}} text='Topics' onClick={() =>
                                    this.setState({
                                        membersOption: false,
                                        topic: true,
                                        related: false,
                                        about: false,
                                        all: false,
                                        followers: false,
                                        mods: false,
                                    })
                                }/>
                            }
                            <Dropdown
                                placeholder="Users"
                                // style={{width:'100%'}}
                                options={[
                                    {key: 'members', text: 'Members'},
                                    {key: 'followers', text: 'Followers'},
                                    {key: 'mods', text: 'Moderators'},
                                    {key: 'all', text: 'All Users'}]}
                                onChange={(e, value) => {

                                    console.log()
                                    if (value.key === "members") {
                                        this.setState({
                                            membersOption: true,
                                            topic: false,
                                            related: false,
                                            about: false,
                                            all: false,
                                            followers: false,
                                            mods: false,
                                        })
                                    } else if (value.key === "followers") {
                                        this.setState({
                                            membersOption: false,
                                            topic: false,
                                            related: false,
                                            about: false,
                                            all: false,
                                            followers: true,
                                            mods: false,
                                        })
                                    } else if (value.key === "mods") {
                                        this.setState({
                                            membersOption: false,
                                            topic: false,
                                            related: false,
                                            about: false,
                                            all: false,
                                            followers: false,
                                            mods: true,
                                        })
                                    } else if (value.key === "all") {
                                        this.setState({
                                            membersOption: false,
                                            topic: false,
                                            related: false,
                                            about: false,
                                            all: true,
                                            followers: false,
                                            mods: false,
                                        })
                                    }
                                }

                                }
                            />
                            {this.state.about === true ? <PrimaryButton style={{fontSize: '16px'}} text='About'/> :
                                <DefaultButton style={{fontSize: '16px'}} text='About' onClick={() =>

                                    this.setState({
                                        membersOption: false,
                                        topic: false,
                                        related: false,
                                        about: true,
                                        all: false,
                                        followers: false,
                                        mods: false,
                                    })
                                }/>
                            }

                        </div>

                    </div>
                    {this.renderOptions()}
                </div>
            )
        } else {
            // alert("Some error ocurred")
            return (
                <p>error</p>
                // <Redirect to='/'/>
            )
        }

    }
}

export default CommunityComponent;