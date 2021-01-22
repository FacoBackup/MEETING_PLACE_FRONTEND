import React from 'react'
import ProfileBarComponent from '../../components/profile/bar/ProfileBarComponent'
import ConversationBarComponent from '../../components/conversations/bar/ConversationBarComponent'
import TopicOpinionsComponent from '../../components/topics/opinions/TopicOpinionsComponent'

class TopicOpinions extends React.Component {
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
                    <TopicOpinionsComponent topicID={this.state.topicID} likes={this.state.likes}/>
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

export default TopicOpinions