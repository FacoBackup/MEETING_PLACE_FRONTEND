import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import "../../../shared/styles/PageModel.css"
import "../../styles/SocialStyle.css"
import {getTheme} from '@fluentui/react';
import Avatar from '@material-ui/core/Avatar'
import {FontSizes, FontWeights} from '@fluentui/theme';
import {Redirect} from 'react-router-dom';
import Host from '../../../../Host'
import Button from "@material-ui/core/Button";
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

const theme = createMuiTheme({
    palette: {
        type: "dark"
    }
});


class FollowingComponent extends React.Component {
    constructor(params) {
        super()
        this.state = {
            cookies: new Cookies(),
            following: [],
            userID: params.userID,
            date: new Date(),
            theme: getTheme(),
            conversations: {},
            redirect: false,
            redirectUserID: ''
        }
    }

    componentDidMount() {
        this.fetchData();

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
            url: Host() + 'api/get/following',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
            data: {
                userID: this.state.userID
            }
        }).then(res => {
            this.setState({
                following: res.data
            })
        })
            .catch(error => {
                console.log(error);
            });
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
            console.log(JSON.stringify(res.data))
            this.setState({
                conversations: res.data
            })

        })
            .catch(error => {
                console.log(error);
                return null
            });
    }

    async setRedirect(userID) {
        console.log("PARAMS => " + userID)
        await this.fetchConversation(userID)
        this.setState({
            redirect: true,
            redirectUserID: userID
        }, () => {
            console.log("STATE => " + JSON.stringify(this.state.redirectUserID))
        })
    }

    render() {
        if (this.state.redirect === false)
            return (

                <div>
                <ThemeProvider theme={theme}>
                    <div className={"component_title_container"} style={{width:'100%', justifyContent:'center', marginBottom:'2vh'}}>
                        <p style={{textAlign: 'center'}}>People you follow</p>
                    </div>
                    {(this.state.following.length === 0 && this.state.userID === (new Cookies()).get("ID")) ?
                        <div>
                            <p style={{
                                textAlign: 'center',
                                fontSize: FontSizes.size16,
                                fontWeight: FontWeights.regular
                            }}>Looks like you don't follow anyone yet, try searching for a friend.</p>
                        </div>
                        : this.state.following.map((flw) =>

                                <div className={"social_content_container"}>
                                    <Avatar
                                        style={{height: '55px', width: '55px'}}
                                        src={flw.imageURL}
                                        alt="user"

                                    />

                                    <ul>
                                        <li style={{fontSize: '17px', fontWeight: '400'}}>
                                            {flw.name}
                                        </li>
                                        <li style={{fontSize: '17px', fontWeight: '400', color: '#aaadb1'}}>
                                            {flw.userName}
                                        </li>
                                    </ul>
                                    {parseInt((new Cookies()).get("ID")) !== flw.userID?
                                        <Button variant={"contained"} href={"/profile/" + flw.userID} disableElevation
                                                style={{marginLeft: '15px'}}>SEE</Button>: null}
                                    {parseInt((new Cookies()).get("ID")) !== flw.userID?
                                        <Button variant={"contained"} color={"primary"} href={"/chat/" + flw.userID+"/false/null"} disableElevation
                                                style={{marginLeft: '15px'}}><ChatRoundedIcon/></Button>: null}
                                </div>

                            //     <DefaultButton text ="See Profile"  href={"/components/"+flw.email+'/0'}/>
                            //     <PrimaryButton onClick={() => this.setRedirect(flw.email)} text="Send Message"/>

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


export default FollowingComponent;