import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "./../../../style/conversation/ConversationBarStyle.css";
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Link } from 'react-router-dom';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { getTheme } from '@fluentui/react';
import Host from '../../../Host'

class ConversationBarComponent extends Component{
    constructor(){
        super()
        this.state={
            cookies: new Cookies(),
            conversations: [],
            theme: getTheme(),
            searchInput:"",
            profiles:[]
        }
        this.handleChange = this.handleChange.bind(this)
    }
    async handleChange(event){
        
        this.setState({
            searchInput: event.target.value
        })
        if(this.state.searchInput !== '')
            await this.fetchSearch()
        else if (this.state.searchInput === '')
            await this.fetchConversations()
    }
    componentDidMount(){
        this.fetchConversations()
        this.timerID = setInterval(
            () => this.tick(),
            60000
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

    async fetchConversations (){
    
        await axios({
            method: 'get',
            url: Host()+'api/conversation/all',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
        }).then(res=>{
            console.log("CONVERSATIONS -> " + JSON.stringify(res.data))
            this.setState({
                conversations: res.data
            })
        })
        .catch(error => {
            console.log(error);
        });
    
      
    }
    async fetchProfile(conversationID){
        await axios({
            method: 'patch',
            url: Host()+'api/get/simplified/user/profile',
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data: {
                userID: conversationID
            }
        }).then(res=>{
            if(res.data !== {})
                this.setState({
                    profiles: res.data
                })
            
        })
        .catch(error => {
            console.log(error)
        });
    }
    async fetchSearch (){    
        await axios({
            method: 'patch',
            url: Host()+'api/conversation/search',
            headers: {"Authorization": 'Bearer '+this.state.cookies.get("JWT")},
            data: {
                conversationID: this.state.searchInput
            }
        }).then(res=>{
            console.log(JSON.stringify(res.data))
            this.setState({
                conversations: res.data
            })
        })
        .catch(error => console.log(error));
    }
    renderPersona(data, isGroup){
        switch(isGroup){
            case true:{

                return(

                    <div>
                        
                        <Link style={{textDecoration: 'none'}} to ={"/chat/" + ((data.name).replace(this.state.cookies.get('ID'), "")) +"/"+JSON.stringify(isGroup) +"/"+data.id}>
                            <Persona
                                {...{
                                    imageUrl:(data.imageURL !== "" ? data.imageURL : null),
                                    text:data.name ,
                                    secondaryText: "Group"
                                }}
                                size={PersonaSize.size40}
                                imageAlt="Conversation"
                            />
                            { typeof data.latestMessage !== 'undefined'? <p style={{ color:"#3b3a39" ,fontSize: FontSizes.size12, fontWeight:FontWeights.regular}}>{(new Date(data.latestMessage).toTimeString())}</p>: ""}
                       
                        </Link>
                            
                        
                    </div>
                    )
            }
            case false:{
                console.log("LATEST MESSAGE -> " + data.latestMessage)
                return(
                    <div className="conversation_persona_container" >
                        <Link style={{textDecoration: 'none'}} to ={"/chat/" + ((data.name).replace(this.state.cookies.get('ID'), "")) +"/"+JSON.stringify(isGroup) +"/"+data.id}>
                            <Persona
                                {...{
                                    imageUrl:(data.imageURL !== "" ? data.imageURL : null),
                                    text: data.userName,
                                    secondaryText: (data.unreadMessages === 0 ? "Private" : "Unseen Messages: " +data.unreadMessages)
                                }}
                                size={PersonaSize.size48}
                                imageAlt="Conversation"
                            />
                            
                            {typeof data.latestMessage !== 'undefined'? <p style={{color:"#3b3a39",textAlign:'center', fontSize: FontSizes.size12, fontWeight:FontWeights.regular}}>{(new Date(data.latestMessage).toString()).substring(0,24)}</p>: ""}
                        </Link>
                    </div>
                )
            }
            default:{
                return(
                    null
                )
            }
        }
    }
    render(){
        return(
            <div className="conversation_bar_component_container">
                <div className="conversation_title_container">
                    <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>Conversations</p>
                </div>
                <div className="conversation_personas">
                {this.state.conversations.map((chat) => 
                    
                    this.renderPersona(chat,chat.isGroup)
                )}
                    
                </div>
                <div className="conversation_search">
                    <TextField placeholder="Search conversation" onChange={this.handleChange} disabled={true}/>
                </div>
                
            </div>
        );
    }
}   

export default ConversationBarComponent;