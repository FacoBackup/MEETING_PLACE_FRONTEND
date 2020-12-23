import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "./ConversationBarStyle.css";
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Link } from 'react-router-dom';

class ConversationBar extends Component{
    constructor(){
        super()
        this.state={
            cookies: new Cookies(),
            conversations: []
        }
    }

    componentDidMount(){
        this.fetchConversations()
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

    fetchConversations = async () =>{
        await axios({
            method: 'get',
            url: 'http://192.168.15.35:8080/api/conversation/all',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
        }).then(res=>{
            this.setState({
                conversations: res.data
            })
        })
        .catch(error => {
            console.log(error);
        });
    }

    render(){
        return(
            <div className="conversation_bar_component_container">
                <div className="conversation_title_container">
                    <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>Conversations</p>
                </div>
                <div className="conversation_content_container">
                    {this.state.conversations.map((chat) => 
                    <div className="conversation_personas_container">
                            <Link style={{textDecoration: 'none', textDecorationColor: '-moz-initial'}} to ={chat.isGroup ? ("/chat/" + chat.id+"/"+JSON.stringify(chat.isGroup)) : ("/chat/" +((chat.name).replace(this.state.cookies.get('ID'), ""))+"/"+JSON.stringify(chat.isGroup))}>
                                <Persona
                                    {...{
                                        text: (chat.isGroup ? (chat.name) : (chat.name).replace(this.state.cookies.get('ID'), "")),
                                        secondaryText: (chat.isGroup ? "Group" : "Private")
                                    }}
                                    size={PersonaSize.size40}
                                    imageAlt="Conversation picture"
                                />
                            </Link>
                    </div>)}
                </div>
                <div className="conversation_title_container">
                    <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>Conversations</p>
                </div>
            </div>
        );
    }
}   

export default ConversationBar;