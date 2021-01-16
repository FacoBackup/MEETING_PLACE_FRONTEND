import React from 'react';
import Cookies from 'universal-cookie';
import "../../style/universal/PageModel.css"
import "../../style/profile/DedicatedProfile.css"
import "../../style/universal/DedicatedPagesStyle.css"
import Conversations from "../../components/conversations/bar/ConversationBarComponent"
import axios from 'axios';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import TopicComponent from '../../components/topics/TopicComponent'
import AboutComponent from '../../components/profile/options/UserAboutComponent'
import Followers from '../../components/social/followers/FollowersComponent'
import Following from '../../components/social/following/FollowingComponent'
import UserCommunitiesComponent from '../../components/profile/options/UserCommunitiesComponent'
import Dexie from "dexie";
import Host from '../../Host'
import ProfileBar from '../../components/profile/bar/ProfileBarComponent'
import Avatar from '@material-ui/core/Avatar'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import PlaceIcon from '@material-ui/icons/Place';
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
                
                <DefaultButton style={{fontSize: '16px'}} text='Send Message' href={'/chat/'+this.state.userID+"/false/"+this.state.userID}/>
                <PrimaryButton style={{fontSize: '16px'}} text='Follow'/>
                <DefaultButton style={{fontSize: '16px'}} text='Topics' href={'/profile/'+this.state.userID+'/0'}/>
                <DefaultButton style={{fontSize: '16px'}} text='Followers' href={'/profile/'+this.state.userID+'/2'}/>
                <DefaultButton style={{fontSize: '16px'}} text='Following' href={'/profile/'+this.state.userID+'/1'}/>
                <DefaultButton style={{fontSize: '16px'}} text='Communities' href={'/profile/'+this.state.userID+'/3'}/>

            </div>
            
        )
    }

   
   
    render(){
        
        return(
            <div>
               
                <div className="profile_center_component">
                    <div className='profile_background_image_container'>
                        <img className='profile_background_image' alt="BACKGROUD"src= {(this.state.profile.backgroundImageURL !== null && typeof this.state.profile.backgroundImageURL !== 'undefined') ? this.state.profile.backgroundImageURL: "https://www.beautycolorcode.com/2f2f2f-1440x900.png"} />
                    </div>
                    <div className="dedicated_component_container">
                        
                        <div className="profile_content_container">
                            <div className='profile_container'>
                                <div style={{marginTop:'1vh',textAlign:'center'}}>
                                    <Avatar
                                        style={{ margin:'auto',height: '85px', width: '85px' }}
                                        src = {this.state.profile.imageURL}
                                        alt="user"
                                    />
                                    <p style={{fontSize:'22px',fontWeight:'500'}}>{this.state.profile.name}</p>
                                    <h4 style={{fontWeight:'500', color:'#aaadb1'}}>{this.state.profile.email}</h4>
                                    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} >
                                        <PlaceIcon/>
                                        {this.state.profile.nationality}
                                    </div>
                                </div>
                                <div >
                                    <ButtonGroup size="large" variant="text" >
                                        <Button style={{display:'grid',lineHeight:'7px', fontSize:'13px'}}>Topics <p style={{color:'#aaadb1'}}>{this.state.profile.topics}</p></Button>
                                        <Button style={{display:'grid',lineHeight:'7px', fontSize:'13px'}}>Followers <p style={{color:'#aaadb1'}}>{this.state.profile.followers}</p></Button>
                                        <Button style={{display:'grid',lineHeight:'7px', fontSize:'13px'}}>Following <p style={{color:'#aaadb1'}}>{this.state.profile.following}</p></Button>
                                        <Button style={{display:'grid',lineHeight:'7px', fontSize:'13px'}}>communities <p style={{color:'#aaadb1'}}>0</p></Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div className='options_container'>
                                
                            </div>
                            <div >
                                {this.optionSelect()}                            
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="left_components">
                    <ProfileBar home={true}/>
                </div>
                <div className="right_components">
                    <Conversations />
                </div>
            </div>
        )
    }
}

export default Profile