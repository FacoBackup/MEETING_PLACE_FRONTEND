import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import "../../style/conversation/ChatStyle.css"
import {Redirect} from 'react-router-dom'
// import Messages from "../../components/messages/MessagesComponent"
import NewMessageComponent from '../../components/messages/NewNewMessageComponent'
import "../../style/universal/PageModel.css"
import ProfileBar from "../../components/profile/bar/ProfileBarComponent.js"
import ConversationsBar from "../../components/conversations/bar/ConversationBarComponent";
import { getTheme } from '@fluentui/react';
import SendMessageComponent from '../../components/messages/SendMessageComponent'
class Conversation extends Component{
    
    constructor({match}){
        super()
        this.state={
            conversationID: match.params.absoluteid,
            receiverName: match.params.username,
            isGroup: match.params.isGroup === 'true' ? true: false,
            token: (new Cookies()).get("JWT"),
            userID: (new Cookies()).get("ID"),
            date: new Date(),
            update: false,
            theme: getTheme(),
            
        }
    }
    componentDidUpdate(){
        window.location.reload()
    }
    componentWillUpdate(params){
    
        if(this.state.id !== params.match.params.id)
            window.location.reload()
    }

    render(){
        if(typeof this.state.token !== 'undefined'){
            return(
                <div className="page_container">
                    
                    <div className="left_components">    
                        <ProfileBar/>
                    
                    </div>
                    <div className="center_component">
                      
                        
                        <NewMessageComponent isGroup={this.state.isGroup} token={this.state.token} conversationID={this.state.conversationID} subjectID={this.state.receiverName} />
                    
                        <SendMessageComponent subjectID={this.state.isGroup === true ? this.state.conversationID : this.state.receiverName} isGroup={this.state.isGroup}/>

                    </div>
                    
                        <div className="right_components" >
                            <ConversationsBar/>
                        </div>
                </div>
            );
        }
        else
            return (<Redirect to="/authenticate"/>);

    }
}   

export default Conversation;