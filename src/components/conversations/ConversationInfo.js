import React, { Component } from 'react';
import { NeutralColors } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import axios from 'axios';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import "./ConversationInfoStyle.css"
import Host from '../../Host'

class ConversationInfo extends Component {
    constructor(params){
        super()
        this.state={
            theme: getTheme(),
            conversation: {},
            conversationID: params.conversationID,
            isGroup: JSON.parse(params.isGroup),
            date: new Date(),
            token: params.token,
            userID: params.userID,
            profile: {}
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
    

    async FetchConversation (){
        
        if(this.state.isGroup === true)
            await axios({
                method: 'post',
                url: Host()+'api/get/conversation/group',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data: {
                    conversationID: this.state.conversationID
                }
            }).then(res=>{
                if(res.data !== {})
                    this.setState({
                        conversation: res.data
                    })
            })
            .catch(error => {
                console.log(error)
            });
        else
            await axios({
                method: 'patch',
                url: Host()+'api/get/simplified/user/profile',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data: {
                    userID: this.state.conversationID
                }
            }).then(res=>{
                if(res.data !== {})
                    this.setState({
                        profile: res.data
                    })
                
            })
            .catch(error => {
                console.log(error)
            });
    } 
    renderPersona(){
        switch(this.state.isGroup){
            case true:{
                return(
                    <div className="conversation_info_container" style={{boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white }}>
                        <Persona
                            {...{
                                text: (typeof this.state.conversation.name === 'undefined' ? this.state.conversationID : this.state.conversation.name),
                                secondaryText: this.state.conversation.about
                            }}
                            size={PersonaSize.size40}
                            imageAlt="Conversation picture"
                        />
                    </div>
                    )
            }
            case false:{
                return(
                    <div className="conversation_info_container" style={{boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white }}>
                    
                    <Persona
                        {...{
                            text: this.state.profile.name ,
                            secondaryText: this.state.profile.email
                        }}
                        size={PersonaSize.size40}
                        imageAlt="Conversation picture"
                    />
                    </div>
                )
            }
            default:{
                return(
                    <div className="conversation_info_container" style={{boxShadow: this.state.theme.effects.elevation8,backgroundColor: NeutralColors.white }}>
                    
                    
                    </div>
                )
            }
        }
    }
    render(){
        return(
            <div>
                {this.renderPersona()}
            </div>
        )
    }
}

export default ConversationInfo;