import "./ProfileStyle.css"
import React from 'react';
import Cookies from 'universal-cookie';
import "../../style/PageModel.css"
import Conversations from "../../components/conversations/ConversationBar"
import axios from 'axios';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import TopicComponent from '../../components/topics/TopicComponent'

class Profile extends React.Component{
    constructor({match}){
        super()
        this.state={
            userID: match.params.userID,
            token: (new Cookies()).get("JWT"),
            profile: {}
        }
    }
    async fetchData () {
        if(typeof this.state.token !== 'undefined'){
            await axios({
                method: 'get',
                url: 'http://localhost:8080/api/get/profile',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data:{
                    userID: this.state.userID
                }
            }).then(res=>{
                this.setState({
                    profile: res.data
                })
            })
            .catch()
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
                            <Persona
                                {...{
                                    imageUrl: (this.state.profile.imageURL === null) ?  this.state.profile.imageURL : "https://preview.redd.it/bq0p7ds60f461.png?width=522&format=png&auto=webp&s=ef1c8eacc400a29430bdc1d3a005270e7762e7c2",
                                    text: this.state.profile.name,
                                    secondaryText:  this.state.profile.email
                                }}
                                size={PersonaSize.size120}
                                imageAlt="USER"
                            />
                            <PrimaryButton text='Follow'/>
                            <PrimaryButton text='Send Message'/>
                            <DefaultButton text='Following' href={'/following/'+this.state.profile.userID}/>
                            <DefaultButton text='Followers' href={'/followers/'+this.state.profile.userID}/>
                            <DefaultButton text='Communities'/>
                            <DefaultButton text='About'/>
                            <DefaultButton text='Home' href='/'/>
                        </div>
                        <div >
                            <TopicComponent community={false} timeline={false} subjectID={this.state.profile.email} token={(new Cookies()).get('JWT')}/>
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