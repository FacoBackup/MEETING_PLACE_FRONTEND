import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "./ConversationBarStyle.css";
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Link } from 'react-router-dom';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { getTheme } from '@fluentui/react';

class ConversationBar extends Component{
    constructor(){
        super()
        this.state={
            cookies: new Cookies(),
            conversations: [],
            theme: getTheme()
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
            url: 'http://localhost:8080/api/conversation/all',
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
                <div className="conversation_personas">
                    {this.state.conversations.map((chat) => 
                    <div className="conversation_persona_container">
                            <Link style={{textDecoration: 'none', textDecorationColor: '-moz-initial'}} to ={"/chat/" + ((chat.name).replace(this.state.cookies.get('ID'), "")) +"/"+JSON.stringify(chat.isGroup) +"/"+chat.id}>
                                <Persona
                                    {...{
                                        text: (chat.isGroup ? (chat.name) : (chat.name).replace(this.state.cookies.get('ID'), "")),
                                        secondaryText: (chat.isGroup ? "Group" : "Private")
                                    }}
                                    size={PersonaSize.size32}
                                    imageAlt="Conversation picture"
                                />
                            </Link>
                    </div>)}
                    
                </div>
                <div className="conversation_search">
                    <TextField placeholder="Search conversation" onChange={console.log("NOT YET ")}/>
                </div>
                
            </div>
        );
    }
}   

export default ConversationBar;