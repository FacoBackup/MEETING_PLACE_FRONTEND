import React from 'react'
import ProfileBar from "../../components/profile/ProfileBar.js"
import Conversations from "../../components/conversations/ConversationBar"
import "../../style/PageModel.css"
import "./CommunityOptionsStyle.css"
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { Redirect } from 'react-router-dom'
import CommunityCreationComponent from '../../components/community/CommunityCreationComponent'
import Cookies from 'universal-cookie';
import UserCommunitiesComponent from '../../components/community/UserCommunitiesComponent'
import CommunitySearchComponent from "../../components/community/CommunitySearchComponent"

class CommunityOptions extends React.Component{
    constructor(){
        super()
        this.state={
            create: false,
            join: false,
            memberIn: true
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
                                <DefaultButton text ="Member In And Following" onClick={ ()=>
                                       this.setState({
                                           create: false,
                                           join: false,
                                           memberIn: true
                                       })
                                }/>
                                <PrimaryButton text ="Create"/>
                                <DefaultButton text ="Join" onClick={()=>
                                    this.setState({
                                        create: false,
                                        memberIn: false,
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
                                <DefaultButton text ="Member In And Following" onClick={ ()=>
                                       this.setState({
                                           create: false,
                                           join: false,
                                           memberIn: true
                                       })
                                }/>
                                <DefaultButton text ="Create" onClick={()=>
                                    this.setState({
                                        create: true,
                                        memberIn: false,
                                        join: false
                                    })
                                }/>
                                <PrimaryButton text ="Join"/>
                               
                            </div>
                            <div>
                                <CommunitySearchComponent token={(new Cookies()).get("JWT")}/>
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
            case this.state.memberIn:{
                return(
                    <div>
                        <div className="center_component">
                            <div  className="community_options_buttons">
                                <PrimaryButton text ="Member In And Following"/>
                                <DefaultButton text ="Create" onClick={()=>
                                    this.setState({
                                        create: true,
                                        memberIn: false,
                                        join: false
                                    })
                                }/>
                                <DefaultButton text ="Join" onClick={()=>
                                    this.setState({
                                        create: false,
                                        memberIn: false,
                                        join: true
                                    })
                                }/>
                                
                            </div>
                            <div>
                                <UserCommunitiesComponent token={(new Cookies()).get("JWT")}/>
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