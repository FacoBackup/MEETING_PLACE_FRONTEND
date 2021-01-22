import React, {Component} from 'react';
import ProfileBar from "../../components/profile/bar/ProfileBarComponent.js"
import Conversations from "../../components/conversations/bar/ConversationBarComponent";
import "../../style/universal/PageModel.css"
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import TopicCreation from '../../components/topics/creation/TopicCreationComponent'
import TopicComponent from '../../components/topics/TopicComponent'

const cookies = new Cookies()

class Timeline extends Component {

    render() {
        if (typeof (cookies).get("JWT") !== 'undefined') {
            return (
                <div className="page_container">
                    <div className="center_component timeline_content_container">
                        <TopicCreation token={(cookies).get("JWT")}/>

                        <TopicComponent token={(cookies).get("JWT")} timeline={true}
                                        subjectID={(cookies).get("ID")} community={false}/>

                    </div>
                    <div className="left_components">
                        <ProfileBar timeline={true}/>
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

export default Timeline;
