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
        fetchConversation()
        fetchMessages()
    },[]);

    const theme = getTheme();
    const cookies = new Cookies();
    const [conversation,setConversation] = useState({});
    const [conversationMessages,setConversationMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    async function fetchConversation (){
        if(match.params.isGroup === true){
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/get/conversation/group',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
                data: {
                    conversationID: match.params.id
                }
            }).then(res=>{
            
                setConversation(res.data);
            })
            .catch(error => {
                alert(error)
            });
        }
        else{
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/get/conversation/user',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
                data: {
                    userID: match.params.id
                }
            }).then(res=>{
            
                setConversation(res.data);
            })
            .catch(error => {
                alert(error)
            });
        }
    }

    async function fetchMessages(){
        if(match.params.isGroup === true){
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/get/conversation/group/messages',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
                data: {
                    conversationID: match.params.id
                }
            }).then(res=>{
                setConversationMessages(res.data);
            })
            .catch(error => {
                alert(error)
            });
        }
        else{
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/get/conversation/user/messages',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
                data: {
                    userID: match.params.id
                }
            }).then(res=>{
                
                setConversationMessages(res.data);
            })
            .catch(error => {
                alert(error)
            });
        }
        
    }

    async function send (){
        if(match.params.isGroup === true){
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/message/group',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
                data: {
                    message: messageInput,
                    imageURL: null,
                    receiverID:null,
                    isGroup: true,
                    conversationID: match.params.id
                }
            }).then(()=>{
                fetchMessages();
            })
            .catch(error => {
                console.log(error);
            });
        }
        else{
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/message/user',
                headers: {"Authorization": 'Bearer ' + cookies.get("JWT")},
                data: {
                    message: messageInput,
                    imageURL: null,
                    receiverID:match.params.id,
                    isGroup: false,
                    conversationID:""
                }
            }).then(()=>{
                fetchMessages();
            })
            .catch(error => {
                console.log(error);
            });
        }
        
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
                <div >
                    {(typeof (conversation.name) !== 'undefined') ? <p style={{fontSize: FontSizes.size18, fontWeight:FontWeights.semibold,textAlign:'center' }}>{(conversation.name).replace(cookies.get("ID"), "")}</p> : <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.semibold,textAlign:'center' }}>{match.params.id}</p>}
                </div>
                <div className="subjectMessageContainer">
                    {conversationMessages.map((message, index) => 
                        <div className={(message.creatorID === cookies.get("ID")) ? "myMessageContentContainer" : "subjectMessageContentContainer"}>
                            <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.semibold }}>{message.content}</p>
                            {/* <TextField readOnly defaultValue={message.content} /> */}
                            <p style={{ fontSize: FontSizes.size12, fontWeight:FontWeights.regular }}> from: {message.creatorID}</p>
                            {(message.creatorID === cookies.get("ID")) ? <p style={{ fontSize: FontSizes.size12, fontWeight:FontWeights.regular }}> seen: {JSON.stringify(message.read)}</p> : <p></p> }
                            <p style={{ fontSize: FontSizes.size12, fontWeight:FontWeights.regular }}>Valid until: {message.valid} hours</p>
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