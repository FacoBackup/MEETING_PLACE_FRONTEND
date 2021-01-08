import "./ProfileStyle.css"
import React from 'react';
import Cookies from 'universal-cookie';
import "../../style/PageModel.css"
import Conversations from "../../components/conversations/ConversationBar"
import axios from 'axios';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import TopicComponent from '../../components/topics/TopicComponent'

import Followers from '../../components/social/followers/Followers'
import Following from '../../components/social/following/Following'
import UserCommunitiesComponent from '../../components/community/UserCommunitiesComponent'
import Dexie from "dexie";
import Host from '../../Host'

class Profile extends React.Component{
    constructor({match}){
        super()
        this.state={
            userID: match.params.userID,
            token: (new Cookies()).get("JWT"),
            profile: {},
            topics: (typeof match.params.option === 'undefined' || match.params.option === '0'? true: false),
            followers: (match.params.option === '1'? true: false),
            following: (match.params.option === '2'? true: false),
            community: match.params.option === '3' ? true: false,
            aboutOption: match.params.option === '4' ? true: false
        }
    }
    componentDidMount(){
        this.fetchData()
    }
    async fetchData () {
        if(typeof this.state.token !== 'undefined'){
            await axios({
                method: 'patch',
                url: Host()+'api/get/profile',
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
    async signout() {
        console.log(this.state.cookies.get("JWT"))
        Object.keys(this.state.cookies.getAll()).forEach(name => this.state.cookies.remove(name))
        localStorage.clear()
        Dexie.delete('api_web_db')
    
        window.location.reload()
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
            case this.state.aboutOption:{
                return(
                    <h1>ABOUT MODULE</h1>
                )
            }
            case this.state.community:{
                return(
                    <UserCommunitiesComponent token={(new Cookies()).get('JWT')}/>
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
                            <img className='profile_background_image_style' alt="BACKGROUD"src= {this.state.profile.imageURL} />
                        </div>
                        <div className='profile_action_bar_container'>
                            <div className="profile_persona_container">
                                <Persona
                                    {...{
                                        imageUrl: this.state.profile.imageURL,
                                        text: this.state.profile.name,
                                        secondaryText:  this.state.profile.email
                                    }}
                                    size={PersonaSize.size120}
                                    imageAlt="USER"
                                
                                />
                            </div>
                            <div className="profile_action_bar_buttons_container">
                                
                                {this.state.userID !== (new Cookies()).get("ID")?
                                    <PrimaryButton text='Follow'/>:
                                    <PrimaryButton text='Edit Profile'/>
                                }
                                {this.state.userID !== (new Cookies()).get("ID")?
                                    <PrimaryButton text='Send Message'/>:
                                    <PrimaryButton text='Sign Out' onClick={()=> this.signout()}/>
                                }                            
                                {this.state.community === true ? <PrimaryButton text='Communities'/> : <DefaultButton text='Communities' href={'/profile/'+this.state.profile.email+'/'+'3'}/>}
                                {this.state.followers === true ? <PrimaryButton text='Followers'/> : <DefaultButton text='Followers' href={'/profile/'+this.state.profile.email+'/'+'1'}/> }
                                {this.state.following === true ? <PrimaryButton text='Following'/> : <DefaultButton text='Following' href={'/profile/'+this.state.profile.email+'/'+'2'}/>}
                                {this.state.topics === true ? <PrimaryButton text='Topics'/> : <DefaultButton text='Topics' href={'/profile/'+this.state.profile.email+'/'+'0'}/>}
                                {this.state.aboutOption === true ? <PrimaryButton text='About'/> : <DefaultButton text='About' href={'/profile/'+this.state.profile.email+'/'+'4'}/>}
        
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