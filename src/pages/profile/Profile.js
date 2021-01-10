// import "./ProfileStyle.css"
import React from 'react';
import Cookies from 'universal-cookie';
import "../../style/PageModel.css"
import "../../style/DedicatedPagesStyle.css"
import Conversations from "../../components/conversations/ConversationBar"
import axios from 'axios';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import TopicComponent from '../../components/topics/TopicComponent'
import AboutComponent from '../../components/profile/AboutProfileComponent'
import Followers from '../../components/social/followers/Followers'
import Following from '../../components/social/following/Following'
import UserCommunitiesComponent from '../../components/community/UserCommunitiesComponent'
import Dexie from "dexie";
import Host from '../../Host'
import ProfileBar from '../../components/profile/ProfileBar'

class Profile extends React.Component{
    constructor({match}){
        super()
        this.state={
            userID: match.params.userID,
            token: (new Cookies()).get("JWT"),
            profile: {},
            topics: (typeof match.params.option === 'undefined' || match.params.option === '0'? true: false),
            followers: (match.params.option === '2'? true: false),
            following: (match.params.option === '1'? true: false),
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
                   
                    <TopicComponent community={false} timeline={false} subjectID={this.state.userID} topics={true} token={(new Cookies()).get('JWT')}/>
                )
            }
            case this.state.aboutOption:{
                return(
                    <AboutComponent profile={this.state.profile}/>
                )
            }
            case this.state.community:{
                return(
                    <UserCommunitiesComponent token={(new Cookies()).get('JWT')}/>
                )
            }
            default:{
                return(
                    <TopicComponent community={false} timeline={false} subjectID={this.state.userID} topics={true} token={(new Cookies()).get('JWT')}/>
                   
                )
            }            
        }
    }
    renderFollowButton(){
        if(this.state.userID !== (new Cookies()).get("ID"))
        return(
            <div className="dedicated_action_bar_buttons">
                
                <DefaultButton text='Send Message' href={'/chat/'+this.state.userID+"/false/"+this.state.userID}/>
                <DefaultButton text='Follow'/>
                <DefaultButton text='Topics' href={'/profile/'+this.state.userID+'/0'}/>
                <DefaultButton text='Followers' href={'/profile/'+this.state.userID+'/2'}/>
                <DefaultButton text='Following' href={'/profile/'+this.state.userID+'/1'}/>
                <DefaultButton text='Communities' href={'/profile/'+this.state.userID+'/3'}/>

            </div>
            
        )
    }

    renderProfileBar(){
        if(this.state.userID === (new Cookies()).get("ID"))
            return(
                <ProfileBar followers={this.state.followers} following={this.state.following} topics={this.state.topics} about={this.state.aboutOption} communities={this.state.community}/>
            )
        else
            return(
                <ProfileBar/>
            )
    }
    render(){
        
        return(
            <div>
                <div className="left_components">
                    {this.renderProfileBar()}
                </div>
                <div className="center_component">
                    <div className="dedicated_component_container">
                        <div className='dedicated_image_container'>
                            <img className='dedicated_image_style' alt="BACKGROUD"src= {(this.state.profile.backgroundImageURL !== null && typeof this.state.profile.imageURL !== 'undefined') ? this.state.profile.backgroundImageURL: "https://www.beautycolorcode.com/2f2f2f-1440x900.png"} />
                        </div>
                        <div className='dedicated_action_bar'>
                            <div>
                                <Persona
                                    {...{
                                        imageUrl: this.state.profile.imageURL,
                                        text: this.state.profile.name,
                                        secondaryText:  this.state.profile.email,
                                        tertiaryText: (this.state.profile.phoneNumber),
                                    }}
                                    size={PersonaSize.size72}
                                    imageAlt="USER"
                                
                                />
                            </div>
                            
                            {this.renderFollowButton()}
                            
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