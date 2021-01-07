import React from 'react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../../style/PageModel.css"
import "../SocialStyle.css"
import Profile from "../../../components/profile/Profile"
import ConversationBar from "../../../components/conversations/ConversationBar"
import { getTheme } from '@fluentui/react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { PrimaryButton } from 'office-ui-fabric-react';
import { Redirect } from 'react-router-dom';

class Followers extends React.Component{
    constructor(){
        super()
        this.state={
            cookies: new Cookies(),
            followers: [],
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
            method: 'get',
            url: 'http://localhost:8080/api/followers',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},

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
        console.log("PARAMS => " + userID)
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
            url: 'http://localhost:8080/api/conversation/by/owner',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
            data:{
                userID: param
            }
        }).then(res=>{
            console.log(JSON.stringify(res.data))
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
                <div className="page_container">
                    
                    <div className="left_components">
                        <Profile/>
                    </div>
                    <div className="center_component social_component_container" >
                        <div className="socail_info_container">
                        <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular, textAlign:'center'}}>Followers</p>
                        {this.state.followers.map((follower)=> 
                            <div className="social_personas_container"> 
                                <Persona
                                {...{
                                    imageUrl: (follower.imageURL === null) ?  follower.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                                    text: follower.name,
                                    secondaryText: follower.email
                                }}
                                size={PersonaSize.size48}
                                imageAlt="Conversation picture"
                                />
                                  <PrimaryButton onClick={() => this.setRedirect(follower.email)} text="Send Message"/>
                            </div>
                        )}
                        </div>
                    </div>
                <div className="right_components" >
                        <ConversationBar/>
                </div>
                </div>
            );
            else{
                
                return(
                    <Redirect to={'/chat/'+this.state.redirectUserID+"/false/"+(typeof this.state.conversations.conversationID === 'undefined'? this.state.redirectUserID: this.state.conversations.conversationID)}/>
                )
                
            }
    }
    
}

export default Followers;