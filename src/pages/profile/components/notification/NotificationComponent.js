import React from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';
import Host from '../../../../Host';
import {Button} from '@material-ui/core';
import "../../styles/NotificationComponentStyle.css"
import Avatar from "@material-ui/core/Avatar";
class NotificationComponent extends React.Component {
    subjectImageURL;
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
        this.fetchMessageNotifications().catch(r => console.log(r))
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
                        <div className={"notification_content_container"}>
                            <Avatar src={notification.subjectImageURL} alt={notification.subjectName} style={{width:'60px', height:'60px'}}/>
                            <p style={{textTransform:'capitalize'}}>New messages from: {notification.subjectName}</p>

                            <p style={{color:'#aaadb1'}}>{(new Date(notification.creationDate)).toString().substr(4,17)}</p>
                            <Button variant={"contained"} disableElevation color={"primary"} href={"/chat/"+notification.subjectID +"/false/null"}>See</Button>
                        </div>) :
                        <div style={{marginTop:'1vh',backgroundColor:'#3b424c', borderRadius:'8px', paddingBottom:'10px', paddingTop:'10px'}}>
                            <p style={{textAlign:'center'}}>No new notifications</p>
                        </div>}

                </div>

            )
        }
    }

    render() {
        return (
            <div>
                <div className="notification_buttons_modal_container">
                    <Button color={this.state.messageOption === true ? "primary" : "default"}
                            variant="contained"
                            disableElevation
                            onClick={() => this.setState({
                                messageOption: true,
                                topicsOption: false,
                                communitiesOption: false,
                                page: null,

                            })}>
                        Messages
                    </Button>
                    <Button color={this.state.topicsOption === true ? "primary" : "default"}
                            variant="contained"
                            disableElevation
                            onClick={() => this.setState({
                                messageOption: false,
                                topicsOption: true,
                                communitiesOption: false,
                                page: null,

                            })}>
                        Topics
                    </Button>
                    <Button color={this.state.communitiesOption === true ? "primary" : "default"}
                            variant="contained"
                            disableElevation
                            onClick={() => this.setState({
                                messageOption: false,
                                topicsOption: false,
                                communitiesOption: true,
                                page: null,

                            })}>
                        Communities
                    </Button>
                </div>
                {this.renderMessages()}
            </div>
        )
    }
}

export default NotificationComponent