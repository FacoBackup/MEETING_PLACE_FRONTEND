import React, {Component} from 'react';
import Cookies from 'universal-cookie';
import {Redirect} from 'react-router-dom'
import NewMessageComponent from './components/NewNewMessageComponent'
import "../shared/styles/PageModel.css"
import ProfileBar from "../profile/components/bar/ProfileBarComponent.js"
import ConversationsBar from "./components/ConversationBarComponent";
import {getTheme} from '@fluentui/react';
import SendMessageComponent from './components/SendMessageComponent'
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});


class Conversation extends Component {
    subjectID;

    constructor({match}) {
        super({match})
        this.state = {
            subjectID: match.params.subjectID,
            conversationID: match.params.conversationID,
            isGroup: match.params.isGroup === 'true',
            token: (new Cookies()).get("JWT"),
            userID: (new Cookies()).get("ID"),
            date: new Date(),
            update: false,
            theme: getTheme(),

        }
    }

    componentDidUpdate() {
        window.location.reload()
    }

    componentWillUpdate(nextProps) {

        if (this.state.id !== nextProps.match.params.id)
            window.location.reload()
    }

    render() {
        if (typeof this.state.token !== 'undefined') {
            return (
                <ThemeProvider theme={theme}>
                    <div className="page_container">

                        <div className="left_components">
                            <ProfileBar/>

                        </div>
                        <div className="center_component">


                            <NewMessageComponent isGroup={this.state.isGroup} token={this.state.token}
                                                 conversationID={this.state.conversationID}
                                                 subjectID={this.state.subjectID}/>

                            <SendMessageComponent
                                subjectID={this.state.isGroup === true ? this.state.conversationID : this.state.subjectID}
                                isGroup={this.state.isGroup}/>

                        </div>

                        <div className="right_components">
                            <ConversationsBar/>
                            <div className={"right_bottom_half_container"}>

                            </div>
                        </div>
                    </div>
                </ThemeProvider>
            );
        } else
            return (<Redirect to="/authenticate"/>);

    }
}

export default Conversation;