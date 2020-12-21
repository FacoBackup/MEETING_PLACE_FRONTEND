import React, {useEffect, useState} from 'react';
import "./MessagesStyle.css";
import { NeutralColors } from '@fluentui/theme';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import MessageBox from "./box/MessageBox";
import { DefaultButton, PrimaryButton, IIconProps, ImageIcon } from 'office-ui-fabric-react';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import axios from 'axios';
import Cookies from 'universal-cookie';

function Messages (params){
    
    useEffect(()=>{
        FetchMessages();
    },[])
    
    const cookies = new Cookies(); 
    const theme = getTheme();
    const [messages, setMessages] = useState([]);
    
    const [messageInput, setMessageInput] = useState('');
    const handleChange = (event) => {
        setMessageInput(event.target.value) ;
    }
    const userID = params.userID
    
    const FetchMessages = async() =>{
        
        if(localStorage.getItem("MSG/"+params.conversationId) === null){
            if(params.isGroup  === true){
                await axios({
                    method: 'post',
                    url: 'http://localhost:8080/api/get/all/group/messages',
                    headers: {"Authorization": 'Bearer ' + params.token},
                    data: {
                        conversationID: params.conversationId
                    }
                }).then(res=>{
                    
                    localStorage.setItem(("MSG/"+params.conversationId),JSON.stringify(res.data))
                    
                    setMessages(JSON.parse(localStorage.getItem("MSG/"+params.conversationId)))      
                })
                .catch(error => {
                    alert(error)
                });
            }
            else{
       
                await axios({
                    method: 'post',
                    url: 'http://localhost:8080/api/get/all/user/messages',
                    headers: {"Authorization": 'Bearer ' + params.token},
                    data: {
                        userID: params.conversationId
                    }
                }).then(res=>{
                    localStorage.setItem(("MSG/"+params.conversationId),JSON.stringify(res.data))
                    
                    setMessages(JSON.parse(localStorage.getItem("MSG/"+params.conversationId)))      
                })
                .catch(error => {
                    alert(error)
                });
            }    
        }
        else{ 
            if(params.isGroup  === true){
                await axios({
                    method: 'post',
                    url: 'http://localhost:8080/api/get/new/group/messages',
                    headers: {"Authorization": 'Bearer ' + params.token},
                    data: {
                        conversationID: params.conversationId
                    }
                }).then(res=>{

                    if(res.data !== []){
                        const oldStorage = localStorage.getItem("MSG/"+params.conversationId)
                        localStorage.removeItem("MSG/"+params.conversationId)
                        localStorage.setItem("MSG/"+params.conversationId,{...oldStorage, ...res.data}, {path: "/"} )
                    }
                    
                    setMessages(JSON.parse(localStorage.getItem("MSG/"+params.conversationId)))      
                })
                .catch(error => {
                    alert(error)
                });
            }
            else{
     
                await axios({
                    method: 'post',
                    url: 'http://localhost:8080/api/get/new/user/messages',
                    headers: {"Authorization": 'Bearer ' + params.token},
                    data: {
                        userID: params.conversationId
                    }
                }).then(res=>{
                    
                    if(JSON.stringify(res.data) !== "[]"){
                        const oldStorage = JSON.parse(localStorage.getItem("MSG/"+params.conversationId))
                        localStorage.removeItem("MSG/"+params.conversationId)
                        localStorage.setItem("MSG/"+params.conversationId,JSON.stringify({...oldStorage, ...res.data}, {path: "/"}) )
                    }
                    setMessages(JSON.parse(localStorage.getItem("MSG/"+params.conversationId)))                
                })
                .catch(error => {
                    alert(error)
                });
            }    
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
            .then(res=>{
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
            <div className="messages_component" style={{boxShadow: theme.effects.elevation8,backgroundColor: NeutralColors.white}}>
                {(messages === [] || messages === {}) ? <div> </div> : Object.keys(messages).forEach(message =>(
                    <div className={(message.creatorID === userID) ? "my_message_container" : "subject_message_container"} style={{padding: '1vh'}}>
                        {MessageBox(message.content, message.valid, message.creationDate, userID, message.creatorID, message.read)}
                    </div>))}    
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