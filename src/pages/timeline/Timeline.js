import React, {Component} from 'react';
import ProfileBar from "../../components/profile/bar/ProfileBarComponent.js"
import Conversations from "../../components/conversations/bar/ConversationBarComponent";
import "../../style/universal/PageModel.css"
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import TopicCreation from '../../components/topics/creation/TopicCreationComponent'
import TopicComponent from '../../components/topics/TopicComponent'
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {TextField} from "@material-ui/core";

const cookies = new Cookies()

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

class Timeline extends Component {

    render() {
        if (typeof (cookies).get("JWT") !== 'undefined') {
            return (
                <div className="page_container">
                    <ThemeProvider theme={theme}>

                        <div className="center_component timeline_content_container">
                            <div className={"tag_search_container"}>
                                <TextField variant={"outlined"} style={{width:'90%'}} label={"Search for a tag"} disabled/>
                            </div>

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
                    </ThemeProvider>
                </div>
            );
        } else
            return (<Redirect to="/authenticate"/>);
    }
}

export default Timeline;
