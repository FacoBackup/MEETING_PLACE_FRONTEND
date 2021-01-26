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
                    <div className={"component_title_container"} style={{width:'100%', justifyContent:'center', marginBottom:'2vh'}}>
                        <p style={{textAlign: 'center'}}>Followers</p>
                    </div>
                    {(this.state.followers.length === 0 && this.state.userID === (new Cookies()).get("ID")) ?
                        <div>
                            <p style={{
                                textAlign: 'center',
                                fontWeight: '500'
                            }}>Looks like no one follows you yet.</p>
                        </div>
                        : this.state.followers.map((follower) =>

                            <div className={"social_content_container"}>
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
                                    <Button
                                        disableElevation
                                        style={{ color:'white', textTransform:'capitalize',marginLeft: '15px'}}
                                        variant='outlined'
                                        href={"/profile/" + follower.userID}
                                    >See</Button>: null}
                                {parseInt((new Cookies()).get("ID")) !== follower.userID?
                                    <Button
                                        disableElevation
                                        style={{border:'#39adf6 2px solid', color:'white', textTransform:'capitalize',marginLeft: '15px'}}
                                        variant='outlined'
                                        href={"/chat/" + follower.userID+"/false/null"}
                                    ><ChatRoundedIcon/></Button>: null}
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