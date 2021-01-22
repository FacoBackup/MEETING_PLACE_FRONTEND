import React from 'react'
import ProfileBar from "../../../components/profile/bar/ProfileBarComponent.js"
import Conversations from "../../../components/conversations/bar/ConversationBarComponent"
import "../../../style/universal/PageModel.css"
import "../../../style/community/CommunityOptionsStyle.css"
// import {DefaultButton, PrimaryButton} from 'office-ui-fabric-react';
import Button from "@material-ui/core/Button";
import CommunityCreationComponent from '../../../components/community/creation/CommunityCreationComponent'
import Cookies from 'universal-cookie';
import CommunitySearchComponent from "../../../components/search/community/CommunitySearchComponent"
const cookies = new Cookies()
class CommunityOptions extends React.Component {
    state = {
        create: false
    }

    render() {

        return (
            <div>
                <div className="center_component">
                    {this.state.create === true ?
                        <div className="community_options_buttons">
                            <Button variant="contained" color={this.state.create === true ? "primary" : "default"} disableElevation>Create</Button>
                            <Button variant="contained"  color={this.state.create === false ? "primary" : "default"} disableElevation onClick={() =>
                                this.setState({
                                    create: false
                                })}>
                                Join
                            </Button>
                        </div>:
                        <div className="community_options_buttons">

                            <Button variant="contained" disableElevation color={this.state.create === true ? "primary" : "default"} onClick={() =>
                                this.setState({
                                    create: true
                                })}>
                                create
                            </Button>
                            <Button variant="contained" color={this.state.create === false ? "primary" : "default"} disableElevation>join</Button>
                        </div>

                    }
                    <div>
                        {this.state.create === true ?  <CommunityCreationComponent token={cookies.get("JWT")}/>:<CommunitySearchComponent token={(cookies).get("JWT")} isModal={false}/>}
                    </div>
                </div>

                <div className="left_components">
                    <ProfileBar/>
                </div>
                <div className="right_components">
                    <Conversations/>
                </div>
            </div>

        )
    }
}

export default CommunityOptions