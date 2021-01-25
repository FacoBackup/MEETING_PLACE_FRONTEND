import React, {Component} from 'react';
import ProfileBar from "../profile/components/bar/ProfileBarComponent.js"
import Conversations from "../conversation/components/ConversationBarComponent";
import "../shared/styles/PageModel.css"
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import TopicCreation from '../topic/components/creation/TopicCreationComponent'
import TopicComponent from '../topic/components/TopicComponent'
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
                            <TrendingComponent/>
                        </div>
                    </ThemeProvider>
                </div>
            );
        } else
            return (<Redirect to="/authenticate"/>);
    }
}

export default Home;
