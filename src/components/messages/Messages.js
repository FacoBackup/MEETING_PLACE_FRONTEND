import React from 'react';
import "./MessagesStyle.css";
import { NeutralColors } from '@fluentui/theme';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import MessageBox from "./box/MessageBox";
import { PrimaryButton } from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import axios from 'axios';

class Messages extends React.Component{
    constructor(params){
        super()
        this.state={
            theme: getTheme(),
            messages: [],
            messageInput: '',
            userID : params.userID,
            conversationID: params.conversationID,
            token: params.token,
            isGroup: params.isGroup,
            date:new Date()
        }
        this.handleChange = this.handleChange.bind(this)
    }
    
    componentDidMount(){
        this.timerID = setInterval(
            () => this.tick(),
            500
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        this.FetchMessages();
        this.setState({
            date: new Date(),
        });
    }

    handleChange(event){
        this.setState({
            messageInput: event.target.value
        })
    }

    FetchMessages = async() =>{
        
        if(localStorage.getItem("MSG/"+this.state.conversationID) === null || localStorage.getItem("MSG/"+this.state.conversationID) === "[]"){
            if(this.state.isGroup  === true){
                await axios({
                    method: 'post',
                    url: 'http://localhost:8080/api/get/all/group/messages',
                    headers: {"Authorization": 'Bearer ' +this.state.token},
                    data: {
                        conversationID: this.state.conversationID
                    }
                }).then(res=>{
                    
                    localStorage.setItem(("MSG/"+this.state.conversationID),JSON.stringify(res.data))
                    
                    this.setState({
                        messages:JSON.parse(localStorage.getItem("MSG/"+this.state.conversationID))
                    })
                })
                .catch(error => {
                    console.log(error)
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
                    
                    this.setState({
                        messages:JSON.parse(localStorage.getItem("MSG/"+this.state.conversationID))
                    })
                })
                .catch(error => {
                    console.log(error)
                });
            }    
        }
        else{ 
            if(this.state.isGroup  === true){
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
                    
                    this.setState({
                        messages:JSON.parse(localStorage.getItem("MSG/"+this.state.conversationID))
                    })
                })
                .catch(error => {
                    console.log(error)
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
                        var oldStorage = JSON.parse(localStorage.getItem("MSG/"+this.state.conversationID))
                        console.log("1 Old storage --> " + JSON.stringify(oldStorage)) // ok

                        if(Array.isArray(res.data))
                            localStorage.setItem("MSG/"+this.state.conversationID,JSON.stringify([...oldStorage, ...res.data], {path: "/"}) )
                        else
                        localStorage.setItem("MSG/"+this.state.conversationID,JSON.stringify([...oldStorage, res.data], {path: "/"}) )
                        // console.log("3 Union between old and response --> " + JSON.stringify([...oldStorage, res.data])) // nop
                        console.log("4 New storage --> " + localStorage.getItem("MSG/"+this.state.conversationID))
                    }
                    this.setState({
                        messages: JSON.parse(localStorage.getItem("MSG/"+this.state.conversationID))
                    })
                    
                    
                })
                .catch(error => {
                    console.log(error)
                });
            }    
        }
        
    }
  
    
    SendMessage = async() =>{
        await axios({
            method: 'post',
            url: (this.state.isGroup === true) ? 'http://localhost:8080/api/message/group': 'http://localhost:8080/api/message/user',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data: {
                message: this.state.messageInput,
                imageURL: null,
                receiverID:(this.state.isGroup === true) ? null : this.state.conversationID,
                isGroup: this.state.isGroup,
                conversationID: (this.state.isGroup === true) ? this.state.conversationID: ""
            }
        })
        .then(()=>{
            this.FetchMessages()
        })
        .catch(error => {
            console.log(error);
        });       
    }

    render(){    
        return(
            <div className="messages_component_container">  
                <div className="messages_component" style={{boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white}}>
                    {this.state.messages === [] ? <div>EMPTY</div> : this.state.messages.map((message,index) =>(
                        <div className={(message.creatorID === this.state.userID) ? "my_message_container" : "subject_message_container"} style={{padding: '1vh'}}>
                            
                            {MessageBox(message.content, message.valid, message.creationDate,this.state.userID, message.creatorID, message.read)}
                        </div>
                    )
                    )}    
                </div>
            
                <div className="message_input_container">
                    <div className="message_input_box">
                        <TextField  placeholder="Message" multiline autoAdjustHeight onChange={this.handleChange} />                       
                    </div>
                        
                    <PrimaryButton text="Send" style={{ height:'62px',fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} onClick={this.SendMessage}/>      
                </div>
            </div>
        );
    }    
}   

export default Messages;