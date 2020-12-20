import React, {useEffect, useState} from 'react';
import { NeutralColors } from '@fluentui/theme';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import { DefaultButton, PrimaryButton, IIconProps, ImageIcon } from 'office-ui-fabric-react';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import axios from 'axios';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Cookies from 'universal-cookie';
import "./ConversationInfoStyle.css"
function ConversationInfo(params) {

    useEffect(()=>{
        FetchConversation();
    },[])

    const cookies = new Cookies();
    const theme = getTheme();
    const [conversation, setConversation] = useState({})
  
    const FetchConversation = async()=>{
        if(typeof cookies.get(params.conversationId) === 'undefined'){
            if(params.isGroup === true){
                await axios({
                    method: 'post',
                    url: 'http://localhost:8080/api/get/conversation/group',
                    headers: {"Authorization": 'Bearer ' + params.token},
                    data: {
                        conversationID: params.conversationId
                    }
                }).then(res=>{
                    cookies.remove(params.conversationId)
                    cookies.set(params.conversationId, JSON.stringify(res.data),{path:'/'})
                    setConversation(res.data)
                })
                .catch(error => {
                    alert(error)
                });
            }
            else{
                await axios({
                    method: 'post',
                    url: 'http://localhost:8080/api/get/conversation/user',
                    headers: {"Authorization": 'Bearer ' + params.token},
                    data: {
                        userID: params.conversationId
                    }
                }).then(res=>{
                    cookies.remove(params.conversationId)
                    cookies.set(params.conversationId, JSON.stringify(res.data),{path:'/'})
                    setConversation(res.data)
               
                })
                .catch(error => {
                    alert(error)
                });
            }
        }
        else
            setConversation(cookies.get(params.conversationId))
    } 

    return(
        <div className="conversation_info_container" style={{boxShadow: theme.effects.elevation8,backgroundColor: NeutralColors.white }}>
            <Persona
                {...{
                    text: (conversation.isGroup === false && typeof conversation.name !== 'undefined' ? (conversation.name).replace(params.userID, "") : (conversation.name)),
                    secondaryText: (conversation.isGroup ? "Group" : "Private")
                }}
                size={PersonaSize.size48}
                imageAlt="Conversation picture"
            />
        </div>
    );
       
}

export default ConversationInfo;