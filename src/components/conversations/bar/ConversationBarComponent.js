import React, {Component} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import "./../../../style/conversation/ConversationBarStyle.css";
import Badge from '@material-ui/core/Badge';
import {Link} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar'
import {getTheme} from '@fluentui/react';
import Host from '../../../Host'
import {MailRounded} from '@material-ui/icons';

class ConversationBarComponent extends Component {
    unreadMessages;
    constructor() {
        super(null)
        this.state = {
            cookies: new Cookies(),
            conversations: [],
            theme: getTheme(),

            profiles: [],
            lastPage: null
        }
    }

    componentDidMount() {
        this.fetchConversations().catch(r => console.log(r))
        this.timerID = setInterval(
            () => this.tick(),
            60000
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

    async fetchConversations() {
        try {
            await axios({
                method: 'get',
                url: Host() + 'api/conversation/all',
                headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
            }).then(res => {
                console.log("CONVERSATIONS -> " + JSON.stringify(res.data))
                this.setState({
                    conversations: res.data
                })
            })
                .catch(error => {
                    console.log(error);
                });
        } catch (e) {
            console.log(e)
        }
    }

    renderSubject(data, isGroup) {
        switch (isGroup) {
            case true: {

                return (
                    <div className="conversation_box_container " key={data.conversationID}>

                        <Link className="conversation_box_content" key={data.conversationID}
                              style={{textDecoration: 'none', color: 'white'}}
                              to={"/chat/" + ((data.name).replace(this.state.cookies.get('ID'), "")) + "/" + JSON.stringify(isGroup) + "/" + data.id}>

                            <Avatar src={data.imageURL}/>
                            <ul>
                                <li style={{
                                    fontWeight: '500',
                                    textTransform: "capitalize"
                                }}>{("" + data.name)}</li>
                                <li style={{
                                    fontWeight: '300',
                                    fontSize:'15px',
                                    textTransform: "capitalize",
                                    color:'#aaadb1'
                                }}>Group</li>
                            </ul>

                            <Badge color="secondary" style={{marginLeft:'10%'}} badgeContent={data.unreadMessages}>
                                <MailRounded/>
                            </Badge>

                        </Link>
                    </div>
                )
            }
            case false: {

                return (
                    <div className="conversation_box_container" key={data.conversationID}>

                        <Link className="conversation_box_content" key={data.conversationID}
                              style={{textDecoration: 'none', color: 'white'}}
                              to={"/chat/" + (data.userID) + "/" + JSON.stringify(isGroup) + "/" + data.id}>

                            <Avatar src={data.imageURL}/>
                            <ul>
                                <li style={{
                                    fontWeight: '500',
                                    textTransform: "capitalize"
                                }}>{("" + data.userName)}</li>
                                <li style={{
                                    fontWeight: '300',
                                    fontSize:'15px',
                                    textTransform: "capitalize",
                                    color:'#aaadb1'
                                }}>Private</li>
                            </ul>
                            <Badge color="secondary" style={{marginLeft:'10%'}} badgeContent={data.unreadMessages}>
                                <MailRounded/>
                            </Badge>

                        </Link>
                    </div>
                )
            }
            default: {
                return null
            }
        }
    }

    render() {
        return (
            <div className="conversation_bar_component_container">
                <div className="conversation_title_container">
                    <p style={{
                        marginLeft: '5px',
                        fontSize: '17px',
                        fontWeight: '400',
                        textTransform: 'capitalize'
                    }}>Conversations</p>
                </div>
                <div className="conversation_personas">
                    {this.state.conversations.map((chat) =>

                        this.renderSubject(chat, chat.isGroup)
                    )}

                </div>
            </div>
        );
    }
}

export default ConversationBarComponent;