import React from 'react';
import Cookies from 'universal-cookie';
import "../../style/universal/PageModel.css"
import "../../style/universal/DedicatedPagesStyle.css"
import Conversations from "../../components/conversations/bar/ConversationBarComponent"
import axios from 'axios';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { CommandBarButton } from 'office-ui-fabric-react';
import TopicComponent from '../../components/topics/TopicComponent'
import AboutComponent from '../../components/profile/options/UserAboutComponent'
import Followers from '../../components/social/followers/FollowersComponent'
import Following from '../../components/social/following/FollowingComponent'
import UserCommunitiesComponent from '../../components/profile/options/UserCommunitiesComponent'
import Dexie from "dexie";
import Host from '../../Host'
import ProfileBar from '../../components/profile/bar/ProfileBarComponent'

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
                    <UserCommunitiesComponent token={(new Cookies()).get('JWT')} userID={this.state.userID}/>
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
                
                <CommandBarButton style={{fontSize: '16px'}} text='Send Message' href={'/chat/'+this.state.userID+"/false/"+this.state.userID}/>
                <CommandBarButton style={{fontSize: '16px'}} text='Follow'/>
                <CommandBarButton style={{fontSize: '16px'}} text='Topics' href={'/profile/'+this.state.userID+'/0'}/>
                <CommandBarButton style={{fontSize: '16px'}} text='Followers' href={'/profile/'+this.state.userID+'/2'}/>
                <CommandBarButton style={{fontSize: '16px'}} text='Following' href={'/profile/'+this.state.userID+'/1'}/>
                <CommandBarButton style={{fontSize: '16px'}} text='Communities' href={'/profile/'+this.state.userID+'/3'}/>

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