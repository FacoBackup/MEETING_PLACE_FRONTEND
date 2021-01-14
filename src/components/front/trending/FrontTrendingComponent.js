import React from 'react'

import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "./../../../style/conversation/ConversationBarStyle.css";
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Link } from 'react-router-dom';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { getTheme } from '@fluentui/react';
import Host from '../../../Host'

class FrontTrendingComponent extends React.Component{
    constructor(){
        super()
        this.state={
            trendingTopics: []
        }
    }
    renderPersona(){
        return(
            <div>
                <div className="conversation_persona_container" >
                        
                        <Persona
                            {...{
                                imageUrl:null,
                                text: "trending on day (MOST LIKED IN 24 hours)",
                                secondaryText: "teste2"
                            }}
                            size={PersonaSize.size48}
                            imageAlt="Conversation"
                        />
                        
                        
                    
                </div>
             
            </div>
                    
        )
    }
    render(){
        return(

            <div className="conversation_bar_component_container">
                <div className="conversation_title_container">
                    <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular}}>Trending</p>
                </div>
                <div className="conversation_personas">
                    {this.state.trendingTopics.map(topic => 
                        {this.renderPersona()}    
                    )}
                </div>
         
                
            </div>
        )
    }
}

export default FrontTrendingComponent