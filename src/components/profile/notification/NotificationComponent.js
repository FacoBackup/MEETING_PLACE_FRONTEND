import React from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';
import Host from '../../../Host';
import {Button, ButtonGroup} from '@material-ui/core';

class NotificationComponent extends React.Component {
    constructor() {
        super()
        this.state = {
            messageNotifications: [],
            messageOption: true,
            topicsOption: false,
            communitiesOption: false,
            page: null
        }
    }

    componentDidMount() {
        this.fetchMessageNotifications()
    }

    async fetchMessageNotifications() {
        await axios({
            method: this.state.page === null ? 'get' : "patch",
            url: this.state.page === null ? Host() + 'api/fetch/new/message/notifications' : Host() + "api/fetch/page/message/notifications",
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data: {
                page: this.state.page
            }

        }).then(res => {
            console.log(res)
            this.setState({
                messageNotifications: res.data,
                page: res.data.length > 0 ? res.data[res.data.length - 1].page : null
            })
        })
            .catch(error => console.log(error))
    }

    renderMessages() {
        if (this.state.messageOption === true) {
            return (
                <div>
                    {this.state.messageNotifications.length > 0 ? this.state.messageNotifications.map(notification =>
                        <div style={{backgroundColor: 'red', borderRadius: '8px'}}>
                            <p>new message from: {notification.subjectName}</p>

                            <p>at</p>
                        </div>) : null}

                </div>

            )
        }
    }

    render() {
        return (
            <div>
                <ButtonGroup>
                    <Button color={this.state.messageOption === true ? "primary" : "default"}
                            onClick={() => this.setState({
                                messageOption: true,
                                topicOption: false,
                                communitiesOption: false,
                                page: null,

                            })}>
                        Messages
                    </Button>
                    <Button color={this.state.topicsOption === true ? "primary" : "default"}
                            onClick={() => this.setState({
                                messageOption: false,
                                topicOption: true,
                                communitiesOption: false,
                                page: null,

                            })}>
                        Topics
                    </Button>
                    <Button color={this.state.communitiesOption === true ? "primary" : "default"}
                            onClick={() => this.setState({
                                messageOption: false,
                                topicOption: true,
                                communitiesOption: false,
                                page: null,

                            })}>
                        Communities
                    </Button>
                </ButtonGroup>
                {this.renderMessages()}
            </div>
        )
    }
}

export default NotificationComponent