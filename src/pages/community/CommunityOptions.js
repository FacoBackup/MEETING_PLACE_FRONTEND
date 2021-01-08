import React from 'react'
import ProfileBar from "../../components/profile/ProfileBar.js"
import Conversations from "../../components/conversations/ConversationBar"
import "../../style/PageModel.css"
import "./CommunityOptionsStyle.css"
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { Redirect } from 'react-router-dom'
import CommunityCreationComponent from '../../components/community/CommunityCreationComponent'
import Cookies from 'universal-cookie';
import CommunitySearchComponent from "../../components/community/CommunitySearchComponent"

class CommunityOptions extends React.Component{
    constructor(){
        super()
        this.state={
            create: false,
            join: true,
            
        }
    }
    render(){
        switch(true){
            default: {
                return(
                    <Redirect to='/'/>
                )
            }
            case this.state.create: {
                return(
                    <div>
                        <div className="center_component">                   
                            <div className="community_options_buttons">     
                                <PrimaryButton text ="Create"/>
                                <DefaultButton text ="Join" onClick={()=>
                                    this.setState({
                                        create: false,
                                        join: true
                                    })
                                }/>
                                
                            </div>
                            <div>
                                <CommunityCreationComponent token={(new Cookies()).get("JWT")}/>
                            </div>
                        </div>
                      
                        <div className="left_components">
                            <ProfileBar/>
                        </div>
                        <div  className="right_components" >
                            <Conversations/>
                        </div>
                    </div>
                   
                )        
            }
            case this.state.join:{
                return(
                    <div>
                        <div className="center_component">
                            <div  className="community_options_buttons">
                                <DefaultButton text ="Create" onClick={()=>
                                    this.setState({
                                        create: true,
                                 
                                        join: false
                                    })
                                }/>
                                <PrimaryButton text ="Join"/>
                               
                            </div>
                            <div>
                                <CommunitySearchComponent token={(new Cookies()).get("JWT")} isModal={false}/>
                            </div>
                        </div>
                      
                        <div className="left_components">
                            <ProfileBar/>
                        </div>
                        <div  className="right_components" >
                            <Conversations/>
                        </div>
                    </div>
                    )
            }
        }
    }
}

export default CommunityOptions