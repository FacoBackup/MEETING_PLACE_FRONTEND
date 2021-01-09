import React, { Component } from 'react';

import Cookies from 'universal-cookie';
import "./ChatStyle.css"
import {Redirect} from 'react-router-dom'
import Messages from "../../components/messages/Messages"
import "../../style/PageModel.css"
import ProfileBar from "../../components/profile/ProfileBar.js"
import Conversations from "../../components/conversations/ConversationBar";
import { NeutralColors } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import ConversationInfo from "../../components/conversations/ConversationInfo"

class Chat extends Component{
    
    constructor({match}){
        super()
        this.state={
            conversationID: match.params.absoluteid,
            receiverName: match.params.username,
            isGroup: match.params.isGroup,
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
                    
                    <div style={{backgroundColor: NeutralColors.white }} className="left_components">    
                        <ProfileBar/>
                    
                    </div>
                    <div className="center_component">
                        <ConversationInfo userID={this.state.userID} isGroup={this.state.isGroup} token={this.state.token}  conversationID={this.state.receiverName} />
                        
                        <Messages userID={this.state.userID} isGroup={this.state.isGroup} token={this.state.token} conversationID={this.state.conversationID} receiverName={this.state.receiverName} />
                    


                    </div>
                    
                        <div style={{backgroundColor: NeutralColors.white}} className="right_components" >
                            <Conversations/>
                        </div>
                </div>
            );
        }
        else
            return (<Redirect to="/authenticate"/>);

    }
}   

export default Chat;