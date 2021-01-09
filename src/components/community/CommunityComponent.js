import React from 'react'
import axios from 'axios'; 
import TopicComponent from '../topics/TopicComponent'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Host from '../../Host'
import "../../style/DedicatedPagesStyle.css"

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
            related: false
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
            related: false
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
    renderOptions(){
        switch(true){
            case this.state.membersOption:{
                
                return(
                    <div className="dedicated_content_container">
                        {(this.state.members === []) ? <div></div> : this.state.members.map((member) => (
                            <div className='personas_container'>
                                    <Persona
                                        {...{
                                            imageUrl: member.userImageURL,
                                            text: member.userName,
                                            secondaryText:  (typeof member.communityName !== 'undefined') ? "From: " +member.communityName: "Role: " + member.role
                                        }}
                                        size={PersonaSize.size48}
                                        imageAlt="user"
                                    />
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
                <div className="dedicated_component_container">
                    <div className="dedicated_image_container">
                        <img className='dedicated_image_style' alt="BACKGROUD" src= {(this.state.community.imageURL !== null && typeof this.state.community.imageURL !== 'undefined') ?  this.state.community.imageURL : "https://www.beautycolorcode.com/2f2f2f-1440x900.png"} />
                        
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
                                this.setState({
                                    related:true,
                                    topic: false,
                                    membersOption: false
                                })
                            }/> }
                            {this.state.topic === true?  <PrimaryButton text='Topics'/> : <DefaultButton text='Topics' onClick={()=>this.setState({
                                topic: true,
                                membersOption: false,
                                related: false
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