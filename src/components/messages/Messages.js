import React from 'react';
import "./MessagesStyle.css";
import { NeutralColors } from '@fluentui/theme';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import MessageBox from "./box/MessageBox";
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import axios from 'axios';
import Dexie from "dexie";
import Host from '../../Host'
import { Redirect } from 'react-router-dom';


class Messages extends React.Component{
    constructor(params){
        super()
        this.state={
            theme: getTheme(),
            messages: [],
            messageInput: '',
            receiverName: params.receiverName,
            userID : params.userID,
            conversationID: params.conversationID,
            token: params.token,
            isGroup: params.isGroup,
            date:new Date(),
            db:  new Dexie('api_web_db'),
            conversationContainer: React.createRef(),
            fetchedID: null
        }
        this.handleChange = this.handleChange.bind(this)
    }
  
    componentDidMount(){
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if(this.state.fetchedID === null && ((this.state.receiverName === this.state.conversationID) || (this.state.conversationID === "null")))
            this.fetchConversationID()

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



    async fetchConversationID(){
        await axios({
            method: 'patch',
            url: Host()+'api/get/conversationID',
            headers: {"Authorization": 'Bearer ' +this.state.token},
            data: {
                userID: this.state.receiverName
            }
        }).then(res=>{
        
            this.setState({
                fetchedID: res.data
            })
        })
        .catch(error => {
            console.log(error)
        });
    }

    async setMessages(){
        this.setState({
            messages: await this.state.db.messages.where('conversationID').equals(this.state.conversationID).sortBy('creationDate')
        })        
        if(this.state.conversationID !== this.state.receiverName)
            this.scrollToEnd();
    }

    async insertMessages(res){
        this.state.db.transaction('rw', this.state.db.messages, async() => {
            res.forEach(message => {
                const value = this.state.db.messages.where('id').equals(message.id).toArray()
                if((value.length === 0 || typeof value.length === 'undefined' ) && this.state.conversationID !== this.state.receiverName)
                    this.state.db.messages.add({id: message.id, content: message.content,imageURL: message.imageURL, creatorID: message.creatorID, conversationID: message.conversationID, type: message.type, valid: message.valid , creationDate: message.creationDate,seenByEveryone: message.seenByEveryone ,receiverAsUserID: message.receiverAsUserID})

            });
        }).catch(error=>console.log(error))
    }

    scrollToEnd (){
        
        const scroll =
          this.state.conversationContainer.current.scrollHeight -
          this.state.conversationContainer.current.clientHeight;
          this.state.conversationContainer.current.scrollTo(0, scroll);
    };

    async FetchMessages(){

        if(this.state.db.isOpen() === false){
            this.state.db.version(1).stores({
                messages: "id,content,imageURL,creatorID, conversationID, type, valid, creationDate, seenByEveryone, receiverAsUserID",
                topics: "id,header,body,approved, creatorID, mainTopicID, creationDate, communityID, imageURL,subjectName, communityName, subjectImageURL"
            }) 
        }
        await this.state.db.open().catch((error) => {
            console.log(error)
        }) 

        if(this.state.isGroup  === true && this.state.conversationID !== "null" && this.state.conversationID !== null){

            const data = await this.state.db.messages.where("conversationID").equals(this.state.conversationID).toArray()
            await axios({
                method: 'post',
                url: (data.length === 0  ? Host()+'api/get/all/group/messages' : Host()+'api/get/new/group/messages'),
                headers: {"Authorization": 'Bearer ' +this.state.token},
                data: {
                    conversationID: this.state.conversationID
                }
            }).then(res=>{
              
                if(typeof res.data != "undefined" && res.data != null && res.data.length != null && res.data.length !== 0){
                    this.insertMessages(res.data)
                    this.setMessages()  
                }
                if((data.length > 0 && this.state.messages.length === 0) || data.length > this.state.messages.length)
                    this.setMessages()
            })
            .catch(error => {
                console.log(error)
            });
        }
        
        else{
            if(this.state.conversationID !== "null" && this.state.conversationID !== null){
                const data = await this.state.db.messages.where("conversationID").equals(this.state.conversationID).toArray()
        
                await axios({
                    method: 'post',
                    url: (data.length === 0 ? Host()+'api/get/all/user/messages':  Host()+'api/get/new/user/messages'),
                    headers: {"Authorization": 'Bearer ' +this.state.token},
                    data: {
                        userID : this.state.receiverName                    
                    }
                }).then(res=>{
                
                    if(typeof res.data != "undefined" && res.data != null && res.data.length != null && res.data.length !== 0){   
                        this.insertMessages(res.data)
                        this.setMessages()
                    }
                    if((data.length > 0 && this.state.messages.length === 0) || data.length > this.state.messages.length)
                        this.setMessages()
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
            url: (this.state.isGroup === true) ? 'http://192.168.15.35:8080/api/message/group': 'http://192.168.15.35:8080/api/message/user',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data: {
                message: this.state.messageInput,
                imageURL: null,
                receiverID:(this.state.isGroup === true) ? null : this.state.receiverName,
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
    
        if(this.state.receiverName !== this.state.conversationID && this.state.conversationID !== "null")
            return(
                <div className="messages_component_container">  
                    <div className="messages_component" style={{backgroundColor: 'white'}} ref={this.state.conversationContainer}>
                        {this.state.messages === [] ? <div></div> : this.state.messages.map((message,index) =>(
                            <div className={(message.creatorID === this.state.userID) ? "my_message_container" : "subject_message_container"} style={{padding: '1vh'}}>
                                {MessageBox(message.content, message.valid, message.creationDate,this.state.userID, message.creatorID, message.seenByEveryone)}
                                <div ref={this.state.essagesEndRef} />
                            </div>   
                        ))}       
                    
                    </div>
                
                    <div className="message_input_container" style={{boxShadow: this.state.theme.effects.elevation8}}>
                        <div className="message_input_box">
                            <TextField  placeholder="Message" multiline autoAdjustHeight onChange={this.handleChange} />                       
                        </div>
                        <div className="message_input_buttons">
                            <PrimaryButton text="Send" style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} onClick={this.SendMessage}/>      
                            <DefaultButton text="Upload Image" style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} disabled={true}/>      
                        </div>    
                    </div>
                </div>
            );
        else{
    
            if((this.state.fetchedID !== null) && ((this.state.receiverName === this.state.conversationID) || this.state.conversationID === "null")){
                console.log("IF 1 " + JSON.stringify(this.state.fetchedID))
                return(
                    <Redirect to={"/chat/" + this.state.receiverName +"/false/" +this.state.fetchedID}/>
                )
            }
            
            else if((this.state.fetchedID === null || this.state.fetchedID === "") &&  ((this.state.receiverName === this.state.conversationID) || this.state.conversationID === "null")){
                console.log("IF 2")
                return(
                    <div className="messages_component_container">  
                        <div className="messages_component" style={{backgroundColor:'white'}}>
                        
                        
                        </div>
                    
                        <div className="message_input_container" style={{boxShadow: this.state.theme.effects.elevation8}}>
                            <div className="message_input_box">
                                <TextField  placeholder="Message" multiline autoAdjustHeight onChange={this.handleChange} />                       
                            </div>
                            <div>
                                <PrimaryButton text="Send" style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} onClick={this.SendMessage}/>      
                            </div>    
                        </div>
                    </div>
                );
            }                
        }
    }    
}   

export default Messages;