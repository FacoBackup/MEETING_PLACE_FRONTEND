import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import "../../../shared/styles/PageModel.css"
import "../../styles/SocialStyle.css"
import {getTheme} from '@fluentui/react';
import Avatar from '@material-ui/core/Avatar'
import {Redirect} from 'react-router-dom';
import Host from '../../../../Host'
import "../../styles/DedicatedProfile.css"
import Button from '@material-ui/core/Button'
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import ChatRoundedIcon from "@material-ui/icons/ChatRounded";

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

class FollowersComponent extends React.Component {
    constructor(params) {
        super()
        this.state = {
            cookies: new Cookies(),
            followers: [],
            userID: params.userID,
            date: new Date(),
            theme: getTheme(),
            conversations: {},
            redirect: false,
            redirectUserID: ''
        }
    }

    componentDidMount() {
        this.fetchData().catch(r => console.log(r))
        this.timerID = setInterval(
            () => this.tick(),
            10000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {

        this.setState({
            date: new Date(),
        });
    }

    async fetchData() {

        await axios({
            method: 'patch',
            url: Host() + 'api/get/followers',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
            data: {
                userID: this.state.userID
            }
        }).then(res => {

            this.setState({
                followers: res.data
            })
        })
            .catch(error => {
                console.log(error);
            });
    }

    async setRedirect(userID) {

        await this.fetchConversation(userID)
        this.setState({
            redirect: true,
            redirectUserID: userID
        }, () => {
            console.log("STATE => " + JSON.stringify(this.state.redirectUserID))
        })
    }

    async fetchConversation(param) {
        await axios({
            method: 'patch',
            url: Host() + 'api/conversation/by/owner',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
            data: {
                userID: param
            }
        }).then(res => {

            this.setState({
                conversations: res.data
            })

        })
            .catch(error => {
                console.log(error);
                return null
            });
    }

    render() {
        if (this.state.redirect === false)
            return (
                <div>
                <ThemeProvider theme={theme}>
                    <p style={{fontSize: '20px', fontWeight: '500', textAlign: 'center'}}>Followers</p>
                    {(this.state.followers.length === 0 && this.state.userID === (new Cookies()).get("ID")) ?
                        <div>
                            <p style={{
                                textAlign: 'center',
                                fontWeight: '500'
                            }}>Looks like no one follows you yet.</p>
                        </div>
                        : this.state.followers.map((follower) =>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    backgroundColor: '#3b424c',
                                    borderRadius: '8px',
                                    paddingRight: '10px',
                                    paddingLeft: '10px'
                                }}>
                                    <Avatar
                                        style={{height: '55px', width: '55px'}}
                                        src={follower.imageURL}
                                        alt="user"

                                    />
                                    <ul>
                                        <li style={{fontSize: '17px', fontWeight: '400'}}>
                                            {follower.name}
                                        </li>
                                        <li style={{fontSize: '17px', fontWeight: '400', color: '#aaadb1'}}>
                                            {follower.userName}
                                        </li>
                                    </ul>
                                    {parseInt((new Cookies()).get("ID")) !== follower.userID?
                                        <Button variant={"contained"} href={"/profile/" + follower.userID} disableElevation
                                             style={{marginLeft: '15px'}}>SEE</Button>: null}
                                    {parseInt((new Cookies()).get("ID")) !== follower.userID?
                                        <Button variant={"contained"} color={"primary"} href={"/chat/" + follower.userID+"/false/null"} disableElevation
                                                style={{marginLeft: '15px'}}><ChatRoundedIcon/></Button>: null}
                                </div>

                        )}
                </ThemeProvider>
                </div>
            );
        else {

            return (
                <Redirect
                    to={'/chat/' + this.state.redirectUserID + "/false/" + (typeof this.state.conversations.conversationID === 'undefined' ? this.state.redirectUserID : this.state.conversations.conversationID)}/>
            )

        }
    }

}

export default FollowersComponent;