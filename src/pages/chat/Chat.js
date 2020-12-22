import React, {Component, useEffect, useState} from 'react';
import Navigation from "../../components/navigation/NavigationBar"
import Cookies from 'universal-cookie';
import "./ChatStyle.css"
import {Redirect} from 'react-router-dom'
import Messages from "../../components/messages/Messages"
import "../../style/PageModel.css"
import Profile from "../../components/profile/Profile"
import Conversations from "../../components/conversations/ConversationBar";
import { NeutralColors } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import ConversationInfo from "../../components/conversations/ConversationInfo"

class Chat extends Component{
    
    constructor({match}){
        super()
        this.state={
            id: match.params.id,
            isGroup: match.params.isGroup,
            token: (new Cookies()).get("JWT"),
            userID: (new Cookies()).get("ID"),
            date: new Date(),
            update: false,
            theme: getTheme()
        }
    }

    componentDidUpdate(params){
        if(this.state.id !== params.match.params.id)
            window.location.reload()
    }
    
    componentDidMount(){
        
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
            update:true
        })
        this.setState({
            date: new Date(),
            update:false
        });
    }
    
    render(){
        if(typeof this.state.token !== 'undefined'){
            return(
                <div className="page_container">
                <div className="top_container">
                    <Navigation/>
                </div>
                <div style={{ borderRadius: '8px',backgroundColor: NeutralColors.white }} className="left_components">
                    <div >
                      <Profile/>
                    </div>
                </div>
                <div className="middle_components">
                    <ConversationInfo userID={this.state.userID} isGroup={this.state.isGroup} token={this.state.token} conversationId={this.state.id} />
                    <Messages userID={this.state.userID} isGroup={this.state.isGroup} token={this.state.token} conversationId={this.state.id} update={this.state.update}/>
                </div>
                
                    <div style={{borderRadius: '8px',backgroundColor: NeutralColors.white}} className="right_components" >
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