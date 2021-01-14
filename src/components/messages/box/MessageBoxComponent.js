import "../../../style/messages/MessageBoxStyle.css";
import { FontSizes, FontWeights } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import React from 'react'
import axios from 'axios';
import Host from '../../../Host'
import Cookies from 'universal-cookie';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';

class MessageBoxComponent extends React.Component {
    constructor(params){
        super()
        this.state={
            content: params.content ,
            imageURL: params.imageURL ,
            creationDate: params.creationDate ,
            userID: params.userID,
            creatorID: params.creatorID,
            read: params.read,
            messageID: params.messageID,
            conversationID: params.conversationID,
            date: new Date(),
            conversation: params.conversation,
            isGroup: params.isGroup
        }
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
        if(this.state.read === false)
            this.VerifySeenStatus();
            
        this.setState({
            date: new Date(),
        });
    }
    async VerifySeenStatus(){
        
        await axios({
            method: 'patch',
            url: Host()+ 'api/seen/by/everyone/check',
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data: {
                messageID: this.state.messageID,
                conversationID: this.state.conversationID
            }
        })
        .then(res=>{
            
            this.setState({
                read: res.data
            })
        })
        .catch(error => {
            console.log(error);
        }); 
    }

    renderImage (){
        
        if(typeof this.state.imageURL !== 'undefined')
            return(
                <div>
                    <img style={{borderRadius:'8px', width: '500px'}} alt="message" src={this.state.imageURL}/>
                </div>
            )
    }
    renderPersona(){
        switch(this.state.isGroup){
            case true:{
                return(
                
                    <Persona
                        {...{
                            text: (typeof this.state.conversation.name === 'undefined' ? this.state.conversationID : this.state.conversation.name),
                           
                        }}
                        size={PersonaSize.size40}
                        imageAlt="Conversation picture"
                    />
                   
                    )
            }
            case false:{
            
                return(
                    <Persona
                        {...{
                            text: this.state.conversation.name ,
                            secondaryText: this.state.conversation.email
                        }}
                        size={PersonaSize.size40}
                        imageAlt="Conversation picture"
                    />
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
        if(this.state.creatorID === this.state.userID)
            return (
                <div className="my_message_box_container" style={(this.state.read === true) ? {boxShadow: (getTheme()).effects.elevation4, border: '5px solid rgba(0, 255, 0, .5)'}  : {boxShadow: (getTheme()).effects.elevation4, border: '5px solid rgba(237,235,233, .3)'} } >
                    <p style={{fontSize: FontSizes.size16, fontWeight:FontWeights.semibold}}>{this.state.content}</p>
                    {this.renderImage()}
                    <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular, color:"#3b3a39"}}>{(new Date(this.state.creationDate)).toLocaleString()}</p>
                    
                </div>
            )
        else
            return (
                <div className="subject_message_box_container" style={{boxShadow: (getTheme()).effects.elevation4 }}>
                    {this.renderPersona()}
                    <p style={{fontSize: FontSizes.size16, fontWeight:FontWeights.semibold}}>{this.state.content}</p>
                    {this.renderImage()}
                    
                    <p style={{fontSize: FontSizes.size12, fontWeight:FontWeights.regular, color:"#3b3a39"}}>Sent on: {(new Date(this.state.creationDate)).toLocaleString()}</p>
                    
                </div>
            )
    }   
   
}
export default MessageBoxComponent;