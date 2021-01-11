import React from 'react';
import "../../style/messages/MessagesStyle.css";
import { FontSizes, FontWeights } from '@fluentui/theme';
import MessageBox from "./box/MessageBoxComponent";
import { DefaultButton, Modal, PrimaryButton } from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import axios from 'axios';
import Dexie from "dexie";
import Host from '../../Host'
import { Redirect } from 'react-router-dom';


class MessagesComponent extends React.Component{
    constructor(params){
        super()
        this.state={

            messages: [],
            messageInput: '',
            receiverName: params.receiverName,
            userID : params.userID,
            conversationID: params.conversationID,
            token: params.token,
            isGroup: (params.isGroup === "true")? true : false,
            date:new Date(),
            db:  new Dexie('api_web_db'),
            conversationContainer: React.createRef(),
            fetchedID: null,
            imageURL: null,
            imageModal: false

        }
        this.handleChange = this.handleChange.bind(this)
        this.SendMessage = this.SendMessage.bind(this)
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
  
    getFile(event) {
        console.log(event)

        let reader = new FileReader();
        reader.readAsDataURL(event[0]);
        reader.onload =() =>{
          this.setState({
              imageURL: reader.result
          })
        }
    }
    async SendMessage (){
        await axios({
            method: 'post',
            url: (this.state.isGroup === true) ? Host()+ 'api/message/group': Host()+ 'api/message/user',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data: {
                message: this.state.messageInput,
                imageURL: this.state.imageURL,
                receiverID:(this.state.isGroup === true) ? null : this.state.receiverName,
                isGroup: this.state.isGroup,
                conversationID: (this.state.isGroup === true) ? this.state.conversationID: ""
            }
        })
        .then(()=>{
            this.FetchMessages()
            this.setState({
                imageURL: null,
                messageInput: null
            })
        })
        .catch(error => {
            console.log(error);
        });       
    }
    renderImageModal(){
        if(this.state.imageURL !== null){
            return(
                <div style={{display:'flex', justifyContent:'center'}}>
                    <img style={{margin:'auto',width:'70%', borderRadius:'8px'}} alt="message" src={this.state.imageURL}/>
                </div>
                
            ) 
        }
    }
    renderModal(){
        if(this.state.imageModal === true){
            return(
                <Modal
                titleAriaId={"TESTE"}
                isOpen={true}
                onDismiss={true}
                isBlocking={false}
                
                containerClassName={"contentStyles.container"}
                >
                    <div className='modal_container' >
                        <div className="modal_title_component">
                            <h2 >Upload an image for your message</h2>
                        </div>
                        <div className="modal_top_component" style={{display:'flex', justifyContent:'center'}}>
                            <input type="file"  name="file"  onChange={event => this.getFile(event.target.files)}/>
                        </div>
                        <div className="modal_middle_component" >
                            {this.renderImageModal()}
                        </div>
                        <div className="modal_bottom_component" style={{display:'flex', justifyContent:'space-between'}}>
                            {this.state.imageURL === null ? 
                            <DefaultButton text="Cancel" onClick={()=> this.setState({
                                imageModal: false
                            })}/> : 
                            <DefaultButton text="Remove Image" onClick={()=> this.setState({
                                imageURL: null
                            })}/>    
                        }
                            
                            <PrimaryButton text="Choose" onClick={()=> this.setState({
                                imageModal: false,
                                communityModal:false,
                                openModal:false
                            })}/>
                        </div>
                    </div>
                </Modal>
           )

        }
    }
    renderSelectedImage(){
        if(this.state.imageURL !== null)
            return(
                <div style={{display:'grid', alignContent:'center', paddingLeft:'.3vw', paddingRight:'.3vw'}}>
                    <img style={{margin:'auto',width:'100px', borderRadius:'8px'}} alt="message" src={this.state.imageURL}/>
                </div>  
            ) 
    }
    render(){    
    
        if(this.state.receiverName !== this.state.conversationID && this.state.conversationID !== "null")
            return(
                <div className="messages_component_container">  
                    <div className="messages_component" style={{backgroundColor: 'white'}} ref={this.state.conversationContainer}>
                        {this.state.messages === [] ? <div></div> : this.state.messages.map((message,index) =>(
                            <div className={(message.creatorID === this.state.userID) ? "my_message_container" : "subject_message_container"} style={{padding: '1vh'}}>
                                <MessageBox content= {message.content} imageURL={message.imageURL} creationDate= {message.creationDate} userID= {this.state.userID}  creatorID={message.creatorID}  read={message.seenByEveryone}/>
                                <div ref={this.state.essagesEndRef} />
                            </div>   
                        ))}   
                              
                    </div>
                    {this.renderModal()}
               
                    <div className="message_input_container" >
                        <div className="message_input_box">
                            <TextField  placeholder="Message" multiline autoAdjustHeight onChange={this.handleChange} />                       
                        </div>
                        
                        {this.renderSelectedImage()}  
                        <div className="message_input_buttons">
                            <PrimaryButton text="Send" style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} onClick={this.SendMessage}/>      
                            <DefaultButton style={{ fontSize: FontSizes.size14, fontWeight: FontWeights.semibold }} text="Upload Image" onClick={()=> 
                            this.setState({
                                imageModal: true
                            })
                            }/>
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

export default MessagesComponent;