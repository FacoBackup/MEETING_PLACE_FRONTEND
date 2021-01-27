import React, {Component} from 'react';
import ProfileBar from "../profile/components/bar/ProfileBarComponent.js"
import Conversations from "../conversation/components/ConversationBarComponent";
import "../shared/styles/PageModel.css"
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import TopicCreation from '../topic/components/creation/TopicCreationComponent'
import SubjectTopicsComponent from '../topic/components/SubjectTopicsComponent'
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {TextField} from "@material-ui/core";
import TrendingComponent from "../topic/components/trending/TrendingComponent";

const cookies = new Cookies()

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

class Home extends Component {
    constructor({match}) {
        super();
        this.state={
            tagID: match.params.tagID
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.location.reload()
    }

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

                            <SubjectTopicsComponent token={(cookies).get("JWT")} timeline={(!(this.state.tagID !== null && typeof this.state.tagID !== 'undefined'))} subjectTopics={false} tagID={this.state.tagID}
                                                    subjectID={(cookies).get("ID")} community={false}/>
                        </div>
                        <div className="left_components">
                            <ProfileBar timeline={true}/>
                        </div>
                        <div className="right_components">
                            <Conversations/>
                            <TrendingComponent tagID={this.state.tagID}/>
                        </div>
                    </ThemeProvider>
                </div>
            );
        } else
            return (<Redirect to="/authenticate"/>);
    }
}

export default Home;
