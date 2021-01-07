import "./ProfileStyle.css"
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import "./ChatStyle.css"
import {Redirect} from 'react-router-dom'
import Messages from "../../components/messages/Messages"
import "../../style/PageModel.css"
import ProfileBar from "../../components/profile/ProfileBar.js"
import Conversations from "../../components/conversations/ConversationBar";
import { NeutralColors } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import ConversationInfo from "../../components/conversations/ConversationInfo"

class Profile extends React.Component{
    constructor(match){
        super(match)
        this.state={
            userID: match.params.userID,
            token: (new Cookies()).get("JWT"),
            profile: {}
        }
    }
    async fetchData () {
        if(typeof this.state.token !== 'undefined'){
            await axios({
                method: 'get',
                url: 'http://localhost:8080/api/get/profile',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data:{
                    userID: this.state.userID
                }
            }).then(res=>{
                this.setState({
                    profile: res.data
                })
            })
            .catch()
        }         
    }
    render(){
        return(
            <div>
                UNDER CONSTRUCTION {this.state.userID}
            </div>
        )
    }
}

export default Profile