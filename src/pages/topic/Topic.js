import React from 'react'
import ProfileBarComponent from '../profile/components/bar/ProfileBarComponent'
import ConversationBarComponent from '../conversation/components/ConversationBarComponent'
import TopicComponent from "./components/page/TopicComponent";

class Topic extends React.Component {
    constructor({match}) {
        super({match})
        this.state = {
            likes: (match.params.likes === "true"),
            topicID: match.params.topicID
        }
    }

    render() {
        return (
            <div>
                <div className="center_component">
                    <TopicComponent topicID={this.state.topicID} likes={this.state.likes}/>
                </div>
                <div className="left_components">
                    <ProfileBarComponent/>
                </div>
                <div className="right_components">
                    <ConversationBarComponent/>
                </div>
            </div>
        )
    }
}

export default Topic