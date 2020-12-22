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

class Messages extends Component{
    constructor({params}){
        super()
        this.state={
            theme: getTheme(),
            messages: [],
            messageInput: '',
            userID : params.userID,
            conversationID: params.conversationId,
            update: params.update,
            token: params.token,
            toRender: (
                <div className="messages_component_container">  
                    <div className="messages_component" style={{boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}}>
                        {/* {(localStorage.getItem("MSG/"+params.conversationId) === null || messages.length === 0) ? <div>EMPTY</div> : messages.map((message,index) =>(
                            <div className={(message.creatorID === userID) ? "my_message_container" : "subject_message_container"} style={{padding: '1vh'}}>
                                
                                {MessageBox(message.content, message.valid, message.creationDate, userID, message.creatorID, message.read)}
                            </div>
                        )
                        )}     */}
                    </div>
                
                    <div className="message_input_container">
                        <div className="message_input_box">
                            <TextField  placeholder="Message" multiline autoAdjustHeight onChange={this.handleChange} />                       
                        </div>
                            
                        <PrimaryButton text="Send" style={{ height:'62px',fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} onClick={SendMessage}/>      
                    </div>
                </div>
            )
        }
        this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange(event){
        this.setState({
            messageInput: event.target.value
        })
    }
    FetchMessages = async() =>{
        
        if(localStorage.getItem("MSG/"+this.state.conversationID) === null){
            if(params.isGroup  === true){
                await axios({
                    method: 'post',
                    url: 'http://localhost:8080/api/get/all/group/messages',
                    headers: {"Authorization": 'Bearer ' +this.state.token},
                    data: {
                        conversationID: this.state.conversationID
                    }
                }).then(res=>{
                    
                    localStorage.setItem(("MSG/"+this.state.conversationID),JSON.stringify(res.data))
                    
                    setState({
                        messages:JSON.parse(localStorage.getItem("MSG/"+this.state.conversationID))
                    })
                })
                .catch(error => {
                    alert(error)
                });
            }
            else{
         
                await axios({
                    method: 'post',
                    url: 'http://localhost:8080/api/get/all/user/messages',
                    headers: {"Authorization": 'Bearer ' +this.state.token},
                    data: {
                        userID: this.state.conversationID
                    }
                }).then(res=>{
                    localStorage.setItem(("MSG/"+this.state.conversationID),JSON.stringify(res.data))
                    
                    setState({
                        messages:JSON.parse(localStorage.getItem("MSG/"+this.state.conversationID))
                    })
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
                    headers: {"Authorization": 'Bearer ' + this.state.token},
                    data: {
                        conversationID: this.state.conversationID
                    }
                }).then(res=>{

                    if(res.data !== []){
                        const oldStorage = localStorage.getItem("MSG/"+this.state.conversationID)
                        localStorage.removeItem("MSG/"+this.state.conversationID)
                        localStorage.setItem("MSG/"+this.state.conversationID,{...oldStorage, ...res.data}, {path: "/"} )
                    }
                    
                    setState({
                        messages:JSON.parse(localStorage.getItem("MSG/"+this.state.conversationID))
                    })
                })
                .catch(error => {
                    alert(error)
                });
            }
            else{
       
                await axios({
                    method: 'post',
                    url: 'http://localhost:8080/api/get/new/user/messages',
                    headers: {"Authorization": 'Bearer ' + this.state.token},
                    data: {
                        userID: this.state.conversationID
                    }
                }).then(res=>{
                    
                    if(JSON.stringify(res.data) !== "[]"){
                        alert("ADD MORE MESSAGES")
                        const oldStorage = JSON.parse(localStorage.getItem("MSG/"+this.state.conversationID))
                        localStorage.removeItem("MSG/"+this.state.conversationID)
                        localStorage.setItem("MSG/"+this.state.conversationID,JSON.stringify({...oldStorage, ...res.data}, {path: "/"}) )
                    }
                    setState({
                        messages:JSON.parse(localStorage.getItem("MSG/"+this.state.conversationID))
                    })
                    
                })
                .catch(error => {
                    alert(error)
                });
            }    
        }
        
    }
  
    
    SendMessage = async() =>{
    
        if(params.isGroup === true){
            await axios({
                method: 'post',
                url: 'http://localhost:8080/api/message/group',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data: {
                    message: messageInput,
                    imageURL: null,
                    receiverID:null,
                    isGroup: true,
                    conversationID: this.state.conversationID
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
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data: {
                    message: messageInput,
                    imageURL: null,
                    receiverID: this.state.conversationID,
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

    render(){
        if(this.state.update === true){
            FetchMessages();
            return this.state.toRender
        }
            
        else
            return this.state.toRender
    }    
}   

export default Messages;