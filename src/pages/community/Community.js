import React from 'react'
import ProfileBar from "../../components/profile/bar/ProfileBarComponent.js"
import Conversations from "../../components/conversations/bar/ConversationBarComponent"
import "../../style/universal/PageModel.css"
import {Redirect} from 'react-router-dom'
import Cookies from 'universal-cookie';
import NewCommunityComponent from '../../components/community/NewCommunityComponent'

class Community extends React.Component {
    constructor({match}) {
        super()
        this.state = {
            communityID: match.params.id
        }
    }

    render() {
        if (typeof (new Cookies()).get("JWT") !== 'undefined') {
            return (
                <div>
                    <div>
                        <NewCommunityComponent communityID={this.state.communityID} token={(new Cookies()).get("JWT")}/>
                    </div>
                    <div className="left_components">
                        <ProfileBar/>
                    </div>
                    <div className="right_components">
                        <Conversations/>
                    </div>
                </div>
            );
        } else
            return (<Redirect to="/authenticate"/>);
    }
}

export default Community;
