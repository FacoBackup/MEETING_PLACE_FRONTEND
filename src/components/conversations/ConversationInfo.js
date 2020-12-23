import React, { Component } from 'react';
import { NeutralColors } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import axios from 'axios';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import "./ConversationInfoStyle.css"

class ConversationInfo extends Component {
    constructor(params){
        super()
        this.state={
            theme: getTheme(),
            conversation: {},
            conversationID: params.conversationID,
            isGroup: params.isGroup,
            date: new Date(),
            token: params.token,
            userID: params.userID
        }
    }
    
    componentDidMount(){
        this.FetchConversation()
        this.timerID = setInterval(
            () => this.tick(),
            10000
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        this.setState({
            date: new Date(),
        });
    }
    

    FetchConversation = async()=>{
        
        if(this.state.isGroup === true)
            await axios({
                method: 'post',
                url: 'http://192.168.15.35:8080/api/get/conversation/group',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data: {
                    conversationID: this.state.conversationID
                }
            }).then(res=>{
                this.setState({
                    conversation: res.data
                })
            })
            .catch(error => {
                console.log(error)
            });
        else
            await axios({
                method: 'post',
                url: 'http://192.168.15.35:8080/api/get/conversation/user',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data: {
                    userID: this.state.conversationID
                }
            }).then(res=>{
                this.setState({
                    conversation: res.data
                })
            
            })
            .catch(error => {
                console.log(error)
            });
    
    
    } 
    render(){
        return(
            (
                <div className="conversation_info_container" style={{boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white }}>

                    <Persona
                        {...{
                            text: (this.state.isGroup !== false && typeof this.state.conversation.name !== 'undefined' ? this.state.conversation.name.replace(this.state.userID, "") :  (this.state.conversation.name)),
                            secondaryText: this.state.conversation.about
                        }}
                        size={PersonaSize.size48}
                        imageAlt="Conversation picture"
                    />
                </div>
            )
        );
    }
}

export default ConversationInfo;