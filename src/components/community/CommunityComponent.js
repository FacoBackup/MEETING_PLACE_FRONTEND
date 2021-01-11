import React from 'react'
import axios from 'axios'; 
import TopicComponent from '../topics/TopicComponent'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Host from '../../Host'
import "../../style/DedicatedPagesStyle.css"
import { FontSizes, FontWeights } from '@fluentui/theme';
import Cookies from 'universal-cookie';
import FollowCommunity from './FollowCommunity';

class CommunityComponent extends React.Component{
    constructor(params){
        super()
        this.state={
            community: {},
            token: params.token,
            communityID: params.communityID,
            membersOption: false,
            topic: true,
            date:new Date(),
            members:[],
            related: false,
            about: false,
            relatedCommunities: []
        }
    }

    componentDidMount(){
        this.fetchData()
    }
  

    async fetchData(){
        await axios({
            method: 'patch',
            url: Host()+'api/get/community/by/id',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data:{
                communityID: this.state.communityID
            }
        }).then(res=>{
            this.setState({
                community: res.data
            })
        })
        .catch(error=>console.log(error))
    }

    async fetchMembers(){
        
        this.setState({
            membersOption: true,
            topic:false,
            related: false,
            about: false
        })
  
        await axios({
            method: 'patch',
            url: Host()+'api/get/community/related/users',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data:{
                communityID: this.state.communityID
            }
        }).then(res=>{
            this.setState({
                members: res.data
            })
        })
        .catch(error=>console.log(error))
    }
    async fetchRelatedCommunities(){
        
        this.setState({
            related:true,
            topic: false,
            membersOption: false,
            about: false
        })

        await axios({
            method: 'patch',
            url: Host()+'api/get/all/related/communities',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data:{
                communityID: this.state.communityID
            }
        }).then(res=>{
            console.log("FETCHED RELATED COMMUNITIES -> " + JSON.stringify(res.data))
            this.setState({
                relatedCommunities: res.data
            })
        })
        .catch(error=>console.log(error))
    }

    renderOptions(){
        switch(true){
            case this.state.related: {
            
                return(
                    <div className="dedicated_content_container">
                        <p style={{textAlign:'center', fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>Related Communities</p>
                        {(this.state.relatedCommunities.length === 0) ? <div>
                            <p style={{textAlign:'center', fontSize: FontSizes.size16, fontWeight:FontWeights.regular}}>No communities are related to this one.</p>
                        </div> : this.state.relatedCommunities.map((community) => (
                            <div className='personas_container'>
                                    <Persona
                                        {...{
                                            imageUrl: community.imageURL,
                                            text: community.name,
                                            secondaryText:  (typeof community.about !== 'undefined' && community.about !== null) ? "About this community: " + community.about: null,
                                            tertiaryText: (community.role !== null && typeof community.role !== 'undefined') ? "Your role in this one: " + community.role : null
                                        }}
                                        size={PersonaSize.size72}
                                        imageAlt="community"
                                    />
                                    <DefaultButton text="See Community" href={"/community/"+community.communityID}/>
                                   {typeof community.role === 'undefined' ?  <PrimaryButton text="Follow Community" onClick={() => FollowCommunity()}/> : <DefaultButton text="Quit Community" disabled={true}/> }
                            </div>
                        ))}
                        
                    </div>
        
                )
            }
            case this.state.membersOption:{
                
                return(
                    <div className="dedicated_content_container">
                        
                        <p style={{textAlign:'center', fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>Members and Followers</p>
                        {(this.state.members.length === 0) ? <div>
                            <p style={{textAlign:'center', fontSize: FontSizes.size16, fontWeight:FontWeights.regular}}>Looks like no one is part of this community.</p>
                        </div> : this.state.members.map((member) => (
                            <div className='personas_container'>
                                    <Persona
                                        {...{
                                            imageUrl: member.userImageURL,
                                            text: member.userName,
                                            secondaryText: (member.communityName !== null && typeof member.communityName !== 'undefined') ? "From Related Community : " +member.communityName: null,
                                            tertiaryText: (member.role !== null && typeof member.role !== 'undefined') ? "Member Role : " + member.role : null
                                        }}
                                        size={PersonaSize.size72}
                                        imageAlt="user"
                                    />
                                    {member.userEmail !== (new Cookies()).get("ID") ? <DefaultButton text="Send Message" href={"/chat/"+member.userEmail+"/false/null"}/>: "" }
                            </div>
                        ))}
                        
                    </div>
        
                )
            }
            case this.state.topic:{
                return(
                    <div >
                        <TopicComponent community={true} token={this.state.token} timeline={false} subjectID={this.state.communityID}/>
                    </div>
                )
            }
            case this.state.about:{
                return(
                    <div>
                    ABout this community
                </div>
                )
            }
            default:{
                return(
                    <TopicComponent community={true} token={this.state.token} timeline={false} subjectID={this.state.communityID}/>
                )
            }
        }
    }
    renderFollowButton(){

    }
    renderAbout(){

    }
    render(){
        if(typeof this.state.community.name !== 'undefined'){
            return(
                <div className="dedicated_component_container">
                    <div className="dedicated_image_container">
                        <img className='dedicated_image_style' alt="BACKGROUD" src= {(this.state.community.backgroundImageURL !== null && typeof this.state.community.backgroundImageURL !== 'undefined') ?  this.state.community.backgroundImageURL : "https://www.beautycolorcode.com/2f2f2f-1440x900.png"} />
                        
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

                            {this.state.membersOption === true ? <PrimaryButton text='Members And Followers'/> : <DefaultButton text='Members And Followers' onClick={()=>
                                this.fetchMembers()
                            }/> }
                             {this.state.related === true ? <PrimaryButton text='Related Communities'/> : <DefaultButton text='Related Communities' onClick={()=>
                                this.fetchRelatedCommunities()
                            }/> }
                            {this.state.topic === true?  <PrimaryButton text='Topics'/> : <DefaultButton text='Topics' onClick={()=>this.setState({
                                topic: true,
                                membersOption: false,
                                related: false,
                                about: false
                            })}/>                                
                            }
                            {this.state.about === true?  <PrimaryButton text='About'/> : <DefaultButton text='About' onClick={()=>this.setState({
                                topic: false,
                                membersOption: false,
                                related: false,
                                about: true
                            })}/>                                
                            }
                        </div>
                        
                    </div>
                    {this.renderOptions()}
                </div>
            )
        }  
        else{
            // alert("Some error ocurred")
            return(
                <p>error</p>
                // <Redirect to='/'/>
            )
        } 
            
    }
}

export default CommunityComponent;