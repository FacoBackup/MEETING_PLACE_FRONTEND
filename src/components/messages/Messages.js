import React, {useEffect, useState} from 'react';
import "./MessagesStyle.css";
import { NeutralColors } from '@fluentui/theme';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import MessageBox from "./box/MessageBox";
import { DefaultButton, PrimaryButton, IIconProps, ImageIcon } from 'office-ui-fabric-react';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import axios from 'axios';

function Messages (params){
    
    useEffect(()=>{
        FetchMessages();
    },[])
    
    // const cookies = new Cookies(); 
    const theme = getTheme();
    const [messages, setMessages] = useState([]);
    
    const [messageInput, setMessageInput] = useState('');
    const handleChange = (event) => {
        setMessageInput(event.target.value) ;
    }
    const userID = params.userID
    
    const FetchMessages = async() =>{
        // if(typeof cookies.get("MESSAGES") === 'undefined'){

        // }
        // else{ 
        //     FETCH NEW MESSAGES
        //     setMessages(cookies.get(params.conversationId))
        // }
        if(params.isGroup  === true){
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/get/conversation/group/messages',
                headers: {"Authorization": 'Bearer ' + params.token},
                data: {
                    conversationID: params.conversationId
                }
            }).then(res=>{
                setMessages(res.data);
            })
            .catch(error => {
                alert(error)
            });
        }
        else{
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/get/conversation/user/messages',
                headers: {"Authorization": 'Bearer ' + params.token},
                data: {
                    userID: params.conversationId
                }
            }).then(res=>{
                setMessages(res.data);
            })
            .catch(error => {
                alert(error)
            });
        }    
    }

  
    
    const SendMessage = async() =>{
        
        if(params.isGroup === true){
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/message/group',
                headers: {"Authorization": 'Bearer ' + params.token},
                data: {
                    message: messageInput,
                    imageURL: null,
                    receiverID:null,
                    isGroup: true,
                    conversationID: params.conversationId
                }
            })
            .then(()=>{
                FetchMessages()
            })
            .catch(error => {
                console.log(error);
            });
        }
        else{
      
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/message/user',
                headers: {"Authorization": 'Bearer ' + params.token},
                data: {
                    message: messageInput,
                    imageURL: null,
                    receiverID: params.conversationId,
                    isGroup:false,
                    conversationID:""
                }
            })
            .then(()=>{
               
                FetchMessages()
            })
            .catch(error => {
                alert(error)
            });
        }   
    }
    
    const toRender = (
        <div className="messages_component_container">  
          <div className="messages_component" style={{boxShadow: theme.effects.elevation8,backgroundColor: NeutralColors.white }}>
                {messages.map((message, index) => 
                    <div className={(message.creatorID === userID) ? "my_message_container" : "subject_message_container"}>
                        {MessageBox(message.content, message.valid, message.creationDate, userID, message.creatorID, message.read)}
                    </div>)}    
                
            </div>
            <div className="message_input_container">
                <div className="message_input_box">
                    <TextField  placeholder="Message" multiline autoAdjustHeight onChange={handleChange} />                       
                </div>
                    
                <PrimaryButton text="Send" style={{ height:'6.3vh',fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} onClick={SendMessage}/>      
            </div>
        </div>
    
    );

    if(params.update === true){
        FetchMessages();
        return toRender
    }
        
    else
        return toRender

}   

export default Messages;