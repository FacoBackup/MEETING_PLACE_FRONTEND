import Profile from "../../components/profile/Profile"
import Conversations from "../../components/conversations/ConversationBar"
import "../../style/PageModel.css"
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';

import "./CommunityOptionsStyle.css"
import { DefaultButton, getTheme, PrimaryButton } from 'office-ui-fabric-react';

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
                                CREATE COMPONENT
                            </div>
                        </div>
                      
                        <div className="left_components">
                            <Profile/>
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
                                JOIN COMPONENT
                            </div>
                        </div>
                      
                        <div className="left_components">
                            <Profile/>
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
                                MEMBER IN COMPONENT
                            </div>
                        </div>
                       
                        <div className="left_components">
                            <Profile/>
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