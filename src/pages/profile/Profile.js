import "./ProfileStyle.css"
import React from 'react';
import Cookies from 'universal-cookie';
import "../../style/PageModel.css"
import Conversations from "../../components/conversations/ConversationBar"
import axios from 'axios';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import TopicComponent from '../../components/topics/TopicComponent'
import { Redirect } from "react-router-dom";
import Followers from '../social/followers/Followers'
import Following from '../social/following/Following'

class Profile extends React.Component{
    constructor({match}){
        super()
        this.state={
            userID: match.params.userID,
            token: (new Cookies()).get("JWT"),
            profile: {},
            topics: (typeof match.params.option === 'undefined' || match.params.option === '0'? true: false),
            followers: (match.params.option === '1'? true: false),
            following: (match.params.option === '2'? true: false)
        }
    }
    componentDidMount(){
        this.fetchData()
    }
    async fetchData () {
        if(typeof this.state.token !== 'undefined'){
            await axios({
                method: 'patch',
                url: 'http://localhost:8080/api/get/profile',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data:{
                    userID: this.state.userID
                }
            }).then(res=>{
                console.log("RESPONSE -> " + JSON.stringify(res.data))
                this.setState({
                    profile: res.data
                })
            })
            .catch()
        }         
    }
    optionSelect(){
        switch(true){
            case this.state.followers:{
                return(
                    <Followers userID={this.state.userID}/>
                )
            }
            case this.state.following:{
                return(
                    <Following userID={this.state.userID}/>    
                )
            }
            case this.state.topics:{
                return(
                    <TopicComponent community={false} timeline={false} subjectID={this.state.userID} token={(new Cookies()).get('JWT')}/>
                )
            }
            default:{
                return(
                    <TopicComponent community={false} timeline={false} subjectID={this.state.userID} token={(new Cookies()).get('JWT')}/>
                )
            }            
        }
    }
    render(){
        
        return(
            <div>
                <div className="">
                    <div className="profile_component_container">
                        <div className='profile_background_image_container'>
                            <img className='profile_background_image_style' alt="BACKGROUD IMG"src= {(this.state.profile.backgroundImageURL === null) ?  this.state.profile.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU"}/>
                        </div>
                        <div className='profile_action_bar_container'>
                            <div className="profile_persona_container">
                                <Persona
                                    {...{
                                        imageUrl: (this.state.profile.imageURL === null) ?  this.state.profile.imageURL : "https://preview.redd.it/bq0p7ds60f461.png?width=522&format=png&auto=webp&s=ef1c8eacc400a29430bdc1d3a005270e7762e7c2",
                                        text: this.state.profile.name,
                                        secondaryText:  this.state.profile.email
                                    }}
                                    size={PersonaSize.size120}
                                    imageAlt="USER"
                                
                                />
                            </div>
                            <div className="profile_action_bar_buttons_container">
                                <PrimaryButton text='Follow'/>
                                <PrimaryButton text='Send Message'/>
                                <DefaultButton text='Topics' href={'/profile/'+this.state.profile.email+'/'+'0'}/>
                                <DefaultButton text='Following' href={'/profile/'+this.state.profile.email+'/'+'2'}/>
                                <DefaultButton text='Followers' href={'/profile/'+this.state.profile.email+'/'+'1'}/>
                                <DefaultButton text='Communities'/>
                                <DefaultButton text='About'/>
                                <DefaultButton text='Home' href='/'/>
                            </div>
                        </div>
                        <div >
                            {this.optionSelect()}                            
                        </div>
                    </div>
                    
                </div>
             
                <div className="right_components">
                    <Conversations />
                </div>
            </div>
        )
    }
}

export default Profile