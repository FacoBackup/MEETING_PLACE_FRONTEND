import React from 'react'
import ProfileBar from "../../components/profile/ProfileBar.js"
import Conversations from "../../components/conversations/ConversationBar"
import "../../style/PageModel.css"
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';
import CommunityComponent from '../../components/community/CommunityComponent'

class Community extends React.Component{
    constructor({match}){
        super()
        this.state={
            communityID: match.params.id
        }
    }
    render(){
        if(typeof (new Cookies()).get("JWT") !== 'undefined'){
            return (
                <div>
                <div className="center_component">
                    <CommunityComponent communityID={this.state.communityID} token={(new Cookies()).get("JWT")}/>
                </div>
                <div className="left_components">
                    <ProfileBar/>
                </div>
                <div  className="right_components" >
                    <Conversations/>
                </div>
            </div>
            );
        }
        else
            return (<Redirect to="/authenticate"/>);
    }
}

export default Community;
