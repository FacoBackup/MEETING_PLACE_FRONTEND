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
            members: false,
            topic: true
        }
    }

    async fetchData(){
        await axios({
            method: 'patch',
            url: 'http://localhost:8080/api/get/community',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
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

    render(){
        if(this.state.community !== {}){
            switch(true){
               
                case this.state.members:{
                    return(
                        <div className="community_component_container">
                            <div className="community_image_container">
                                <img className='profile_background_image_style' alt="BACKGROUD IMG"src= "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU"/>
                            </div>
                            <div className="community_action_bar">
                                <Persona
                                    {...{
                                        imageUrl: '',
                                        text: "COMMUNITY NAME",
                                        secondaryText:  "YOUR ROLE IN IT"
                                    }}
                                    size={PersonaSize.size120}
                                    imageAlt="Community"
                                />
                                <DefaultButton text='Home' href='/' />
                                <PrimaryButton text='Members And Followers'/>
                                <DefaultButton text='Topics' onClick={()=>this.setState({
                                    topic: true,
                                    members: false
                                })}/>                                
                            </div>
                            <div className="community_content_container">
                                MEMBERS HERE
                             {/* <TopicComponent community={true} token={this.state.token} timeline={false} subjectID={this.state.communityID}/> */}
                            </div>
                        </div>
                    )
                }
                case this.state.topic:{
                    return(
                        <div className="community_component_container">
                            <div className="community_image_container">
                                <img className='profile_background_image_style' alt="BACKGROUD IMG"src= "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU"/>
                            </div>
                            <div className="community_action_bar">
                                <Persona
                                    {...{
                                        imageUrl: '',
                                        text: "COMMUNITY NAME",
                                        secondaryText:  "YOUR ROLE IN IT"
                                    }}
                                    size={PersonaSize.size120}
                                    imageAlt="Community"
                                />
                                <DefaultButton text='Home' href='/' />
                                <DefaultButton text='Members And Followers' onClick={()=>this.setState({
                                    topic: false,
                                    members: true
                                })}/>
                                <PrimaryButton text='Topics'/>
                            </div>
                            <div className="community_content_container">
                                <TopicComponent community={true} token={this.state.token} timeline={false} subjectID={this.state.communityID}/>
                            </div>
                        </div>
                    )
                }
                default:{
                    return(
                        <Redirect to='/'/>
                    )
                }
            }
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