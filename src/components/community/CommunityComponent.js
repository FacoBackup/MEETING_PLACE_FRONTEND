import React from 'react'
import axios from 'axios'; 
import TopicComponent from '../topics/TopicComponent'
import { PrimaryButton,CommandBarButton, DefaultButton } from 'office-ui-fabric-react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Host from '../../Host'
import "../../style/universal/DedicatedPagesStyle.css"
import { FontSizes, FontWeights } from '@fluentui/theme';
import Cookies from 'universal-cookie';
import FollowCommunity from '../../functions/community/FollowCommunity';

class CommunityComponent extends React.Component{
    constructor(params){
        super()
        this.state={
            community: {},
            token: params.token,
            communityID: params.communityID,
            membersOption: false,
            all: false,
            mods:false,
            followers:false,
            topic: true,
            date:new Date(),
            members:[],
            related: false,
            about: false,
            relatedCommunities: [],
            dropdownSelectedOption: null
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
            about: false,
            all: false,
            followers:false,
            mods:false
        })
        
        await axios({
            method: 'patch',
            url: Host()+'api/get/all/users',
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
    async fetchMods(){
        
        this.setState({
            membersOption: false,
            topic:false,
            related: false,
            about: false,
            all: false,
            followers:false,
            mods:true
        })
        
        await axios({
            method: 'patch',
            url: Host()+'api/get/mods',
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
    async fetchFollowers(){
        
        this.setState({
            membersOption: false,
            topic:false,
            related: false,
            about: false,
            all: false,
            followers:true,
            mods:false
        })
        
        await axios({
            method: 'patch',
            url: Host()+'api/get/followers',
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
    async fetchAll(){
        
        this.setState({
            membersOption: false,
            topic:false,
            related: false,
            about: false,
            all: true,
            followers:false,
            mods:false
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
        
            case this.state.membersOption || this.state.all || this.state.mods || this.state.followers:{
                
                return(
                    <div className="dedicated_content_container">
                        
                        <p style={{textAlign:'center', fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>{this.renderPageName()}</p>
                        {this.state.members.map((member) => (
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
    renderPageName(){
        switch(true){
            case this.state.all:{
                return(
                    "All Users Related To This Community"
                )
            }
            case this.state.mods: {
                return(
                    "Moderators"
                )
            }
            case this.state.membersOption:{
                return(
                    "Members"
                )
            }
            case this.state.followers:{
                return(
                    "Followers"
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
                        {/* <Dropdown 
                            placeholder="Selected Options"
                            
                            options={[
                                { key: 'members', text: 'Members'},
                                { key: 'followers', text: 'Followers',  },
                                { key: 'mods', text: 'Moderators' },
                                { key: 'all', text: 'All' },
                              ]}
                            onChange={(e, selectedOption) => {
                               
                                if(selectedOption.key === 'members')
                                    this.setState({
                                        membersOption: true,
                                        topic: false,
                                        related: false,
                                        about:false
                                    })
                            }}
                        /> */}
                        <div className="dedicated_action_bar_buttons">

                            {this.state.membersOption === true ? <CommandBarButton text='Members'style={{fontSize: '16px'}}/> : <CommandBarButton style={{fontSize: '16px'}} text='Members' onClick={()=>
                                this.fetchMembers()
                            }/> }

                            {this.state.followers === true ? <CommandBarButton text='Followers'style={{fontSize: '16px'}}/> : <CommandBarButton style={{fontSize: '16px'}} text='Followers' onClick={()=>
                                this.fetchFollowers()
                            }/> }
                            {this.state.mods === true ? <CommandBarButton text='Moderators'style={{fontSize: '16px'}}/> : <CommandBarButton text='Moderators'style={{fontSize: '16px'}} onClick={()=>
                                this.fetchMods()
                            }/> }
                            {this.state.all === true ? <CommandBarButton text='All Users'style={{fontSize: '16px'}}/> : <CommandBarButton text='All Users'style={{fontSize: '16px'}} onClick={()=>
                                this.fetchAll()
                            }/> }
                             {this.state.related === true ? <CommandBarButton text='Related Communities' style={{fontSize: '16px'}}/> : <CommandBarButton  style={{fontSize: '16px'}} text='Related Communities' onClick={()=>
                                this.fetchRelatedCommunities()
                            }/> }
                            {this.state.topic === true?  <CommandBarButton style={{fontSize: '16px'}} text='Topics'/> : <CommandBarButton style={{fontSize: '16px'}} text='Topics' onClick={()=>this.setState({
                                topic: true,
                                membersOption: false,
                                related: false,
                                about: false
                            })}/>                                
                            }
                            {this.state.about === true?  <CommandBarButton style={{fontSize: '16px'}} text='About'/> : <CommandBarButton style={{fontSize: '16px'}} text='About' onClick={()=>this.setState({
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