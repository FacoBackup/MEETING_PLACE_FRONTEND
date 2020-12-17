import React, {useEffect, useState} from 'react';
import Navigation from "../navigation/NavigationBar"
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../chat/ChatStyle.css";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { getTheme } from '@fluentui/react';
import { NeutralColors } from '@fluentui/theme';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Button } from '@fluentui/react-button';

function Chat ({match}){
    
    useEffect(()=>{
        fetchMessages()
    },[]);
    const theme = getTheme();
    const cookies = new Cookies();
    const [conversation,setConversation] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    
    const fetchMessages = async () =>{
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/get/conversation',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
            data: {
                conversationID: match.params.id
            }
        }).then(res=>{
            setConversation(res.data);
        
        })
        .catch(error => {
            alert( match.params.id)
            
            console.log(error);
        });
    }

    async function send (){
        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/message',
            headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
            data: {
                message: messageInput,
                imageURL: null,
                receiverID:null,
                isGroup: match.params.isGroup,
                conversationID: match.params.id
            }
        }).then(()=>{
            fetchMessages();
        })
        .catch(error => {
            console.log(error);
        });
    };

    function handleChange (event)  {
        setMessageInput(event.target.value) ;
    }

    return(
        <div className="container">
            <div className="navBar"> 
                <Navigation />
            </div>
            <div className="component" style={{boxShadow: theme.effects.elevation8,backgroundColor: NeutralColors.white }}>
                <div>
                    <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.semibold,textAlign:'center' }}>{match.params.id}</p>
                </div>
                <div className="messageContainer">
                    {conversation.map((message, index) => 
                        <div className="message">
                            <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.semibold }}>{message.content}</p>
                            {/* <TextField readOnly defaultValue={message.content} /> */}
                            <p style={{ fontSize: FontSizes.size12, fontWeight:FontWeights.regular }}> from {message.creatorID}</p>
                            <p style={{ fontSize: FontSizes.size12, fontWeight:FontWeights.regular }}> read: {JSON.stringify(message.read)}</p>
                        </div>)}    
                </div>
        
            </div>
            <div className="messageInputContainer" style={{boxShadow: theme.effects.elevation8,backgroundColor: NeutralColors.white }}>
                <div className="input">
                    <TextField  placeholder="Message"multiline autoAdjustHeight onChange={handleChange} />
                </div>
                <div className="button">
                    <Button style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} onClick={send}>Send</Button>
                </div>
            </div>
        </div>
    );

}   

export default Chat;