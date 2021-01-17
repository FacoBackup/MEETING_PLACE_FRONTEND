import React from 'react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../../style/universal/PageModel.css"
import "../../../style/profile/SocialStyle.css"
import { getTheme } from '@fluentui/react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { PrimaryButton,DefaultButton } from 'office-ui-fabric-react';
import { Redirect } from 'react-router-dom';
import Host from '../../../Host'
import "../../../style/profile/DedicatedProfile.css"
class FollowersComponent extends React.Component{
    constructor(params){
        super()
        this.state={
            cookies: new Cookies(),
            followers: [],
            userID: params.userID,
            date: new Date(),
            theme: getTheme(),
            conversations: {},
            redirect: false,
            redirectUserID: ''
        } 
    }
    componentDidMount(){
        this.fetchData();
        this.timerID = setInterval(
            () => this.tick(),
            10000
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
    
        this.setState({
            date: new Date(),
        });
    }
    async fetchData(){
        
        await axios({
            method: 'patch',
            url: Host()+'api/get/followers',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
            data:{
                userID: this.state.userID
            }
        }).then(res=>{
            
            this.setState({
                followers: res.data
            })
        })
        .catch(error => {
            console.log(error);
        });
    }
    async setRedirect(userID){
    
        await this.fetchConversation(userID)
        this.setState({
            redirect: true,
            redirectUserID:userID
        },()=>{
            console.log("STATE => " + JSON.stringify(this.state.redirectUserID))    
        })
    }
    async fetchConversation (param){
        await axios({
            method: 'patch',
            url: Host()+'api/conversation/by/owner',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
            data:{
                userID: param
            }
        }).then(res=>{
            
            this.setState({
                conversations: res.data
            })
            
        })
        .catch(error => {
            console.log(error);
            return null
        });
    }
    render(){
        if(this.state.redirect === false)
            return(    
                <div>
                    <p style={{fontSize:'20px',fontWeight:'500', textAlign:'center'}}>Followers</p>
                    {(this.state.followers.length === 0 && this.state.userID === (new Cookies()).get("ID")) ? 
                        <div>
                            <p style={{textAlign:'center', fontSize: FontSizes.size16, fontWeight:FontWeights.regular}}>Looks like no one follows you yet.</p>
                        </div>
                        :this.state.followers.map((follower)=> 
                        <div className="personas_container"> 
                            <Persona
                            {...{
                                imageUrl: (typeof follower.imageURL !== 'undefined') ?  follower.imageURL : null,
                                text: follower.name,
                                secondaryText: follower.email,
                                tertiaryText: follower.phoneNumber
                            }}
                            size={PersonaSize.size72}
                            imageAlt="Conversation picture"
                            />
                            <DefaultButton  text ="See Profile"  href={"/profile/"+follower.email+'/0'}/>
                            <PrimaryButton onClick={() => this.setRedirect(follower.email)} text="Send Message"/>
                        </div>
                    )}
                </div>
            );
            else{
                
                return(
                    <Redirect to={'/chat/'+this.state.redirectUserID+"/false/"+(typeof this.state.conversations.conversationID === 'undefined'? this.state.redirectUserID: this.state.conversations.conversationID)}/>
                )
                
            }
    }
    
}

export default FollowersComponent;