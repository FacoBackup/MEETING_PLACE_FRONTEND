import React from 'react'
import "./CommunityComponentStyle.css"
import axios from 'axios'; 
import { Redirect } from "react-router-dom";
import TopicComponent from '../topics/TopicComponent'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';

class CommunityComponent extends React.Component{
    constructor(params){
        super()
        this.state={
            community: {},
            token: params.token,
            communityID: params.communityID,
            membersOption: false,
            topic: true,
            members:[]
        }
    }
    componentDidMount(){
        this.fetchData()
    }
    async fetchData(){
        await axios({
            method: 'patch',
            url: 'http://localhost:8080/api/get/community',
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
        await axios({
            method: 'patch',
            url: 'http://localhost:8080/api/get/community/related/users',
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
    renderOptions(){
        switch(true){
            case this.state.membersOption:{
                return(
                    <div className="community_content_container">
                        {(this.state.members === []) ? <div></div> : this.state.members.map((member) => {
                            <div className='persona_container'>
                                    <Persona
                                        {...{
                                            imageUrl: member.imageURL,
                                            text: member.name,
                                            secondaryText:  member.role
                                        }}
                                        size={PersonaSize.size48}
                                        imageAlt="user"
                                    />
                            </div>
                        })}
                        
                    </div>
        
                )
            }
            case this.state.topic:{
                return(
                    <div className="community_content_container">
                        <TopicComponent community={true} token={this.state.token} timeline={false} subjectID={this.state.communityID}/>
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
    render(){
        if(typeof this.state.community.name !== 'undefined'){
            return(
                <div className="community_component_container">
                    <div className="community_image_container">
                        <img className='profile_background_image_style' alt="BACKGROUD"src={this.state.community.backgroundImageURL}/>
                    </div>
                    <div className="community_action_bar">
                        <Persona
                            {...{
                                imageUrl: this.state.community.imageURL,
                                text: this.state.community.name,
                                secondaryText:  this.state.community.about
                            }}
                            size={PersonaSize.size48}
                            imageAlt="Community"
                        />
                        <h6>Your are a {this.state.community.role} in this community.</h6>
                        <div>
                            <DefaultButton text='Home' href='/' />
                            {this.state.membersOption === true ? <PrimaryButton text='Members And Followers'/> : <DefaultButton text='Members And Followers' onClick={()=>
                                this.setState({
                                    membersOption: true
                                })
                            }/> }

                            {this.state.topic === true?  <PrimaryButton text='Topics'/> : <DefaultButton text='Topics' onClick={()=>this.setState({
                                topic: true,
                                membersOption: false
                            })}/>                                
                            }
                        </div>
                        
                    </div>
                    {this.renderOptions()}
                </div>
            )
        }  
        else{
            alert("Some error ocurred")
            return(
                <Redirect to='/'/>
            )
        } 
            
    }
}

export default CommunityComponent;