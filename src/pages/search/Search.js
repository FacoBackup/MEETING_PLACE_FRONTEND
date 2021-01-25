import React, {Component} from 'react';
import UserSearch from "./components/SearchComponent"
import ProfileBar from "../profile/components/bar/ProfileBarComponent.js"
import Conversations from "../conversation/components/ConversationBarComponent"
import "../shared/styles/PageModel.css"
import {Redirect} from 'react-router-dom'
import Cookies from 'universal-cookie';
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import TrendingComponent from "../topic/components/trending/TrendingComponent";

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

class Search extends Component {
    render() {

        if (typeof (new Cookies()).get("JWT") !== 'undefined') {
            return (
                <ThemeProvider theme={theme}>
                    <div className="center_component">
                        <UserSearch token={new Cookies().get("JWT")}/>
                    </div>
                    <div className="left_components">
                        <ProfileBar search={true}/>
                    </div>
                    <div className="right_components">
                        <Conversations/>
                        <TrendingComponent/>
                    </div>
                </ThemeProvider>
            );
        } else
            return (<Redirect to="/authenticate"/>);
    }
}

export default Search;
