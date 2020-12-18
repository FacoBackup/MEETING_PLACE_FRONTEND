import React, {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../chat/ConversationStyle.css";
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Link } from 'react-router-dom';

function Conversations (){
    
    useEffect(()=>{
        fetchMessages()
    },[]);

    const cookies = new Cookies();
    const [conversations,setConversations] = useState([]);
    
    const fetchMessages = async () =>{
        
        await axios({
            method: 'get',
            url: 'http://localhost:8080/api/conversation/all',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
        }).then(res=>{
            setConversations(res.data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return(
        <div className="conversation_component_container">
            <div className="conversation_title_container">
                <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>Conversations</p>
            </div>
            <div className="conversation_content_container">
                {conversations.map((chat, index) => 
                <div className="conversation_personas_container">
                        <Link style={{textDecoration: 'none', textDecorationColor: '-moz-initial'}} to ={chat.isGroup ? ("/chat/" + chat.id+"/"+JSON.stringify(chat.isGroup)) : ("/chat/" +((chat.name).replace(cookies.get('ID'), ""))+"/"+JSON.stringify(chat.isGroup))}>
                            <Persona
                                {...{
                                    text: (chat.isGroup ? (chat.name) : (chat.name).replace(cookies.get('ID'), "")),
                                    secondaryText: (chat.isGroup ? "Group" : "Private")
                                }}
                                size={PersonaSize.size40}
                                imageAlt="Conversation picture"
                            />
                        </Link>
                </div>)}
            </div>
        </div>
    );

}   

export default Conversations;