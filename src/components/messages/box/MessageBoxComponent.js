import "../../../style/messages/MessageBoxStyle.css";
import React from 'react'
import axios from 'axios';
import Host from '../../../Host'
import Cookies from 'universal-cookie';

import Avatar from '@material-ui/core/Avatar'
class MessageBoxComponent extends React.Component {
    constructor(params){
        super()
        this.state={
            content: params.content ,
            imageURL: params.imageURL ,
            creationDate:  ((((new Date()).getTime() - params.creationDate) / (1000*60*60))).toFixed(0),
            userID: params.userID,
            creatorID: params.creatorID,
            read: params.read,
            messageID: params.messageID,
            conversationID: params.conversationID,
            date: new Date(),
            conversation: params.conversation,
            creatorInfo: {},
        
        }
    }
    
    componentDidMount(){
        this.fetchUserInfo()
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if(this.state.read === false)
            this.VerifySeenStatus();
            
        this.setState({
            date: new Date(),
        });
    }
    async VerifySeenStatus(){
        
        await axios({
            method: 'patch',
            url: Host()+ 'api/seen/by/everyone/check',
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data: {
                messageID: this.state.messageID,
                conversationID: this.state.conversationID
            }
        })
        .then(res=>{
            
            this.setState({
                read: res.data
            })
        })
        .catch(error => {
            console.log(error);
        }); 
    }
    async fetchUserInfo(){
        await axios({
            method: 'patch',
            url: Host()+'api/get/simplified/user/profile',
            headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
            data: {
                userID: this.state.creatorID
            }
        }).then(res=>{
            if(res.data !== {})
                this.setState({
                    creatorInfo: res.data
                })
            
        })
        .catch(error => {
            console.log(error)
        });
    }
    renderImage (){
        
        if(typeof this.state.imageURL !== 'undefined')
            return(
                <div>
                    <img style={{borderRadius:'8px', maxWidth: '100%'}} alt="message" src={this.state.imageURL}/>
                </div>
            )
    }
    renderCreatorInfo(){
        return(
            <div style={{display:'flex', justifyContent:(this.state.creatorID === this.state.userID? 'flex-end': 'flex-start'), alignItems:'center'}}>
                <Avatar style={{marginRight:'10px'}} alt={this.state.creatorInfo.name} src={this.state.creatorInfo.imageURL}/>
                <p>{this.state.creatorInfo.name}</p>
            </div>
    
        )
    }
 
    render(){
        if(this.state.creatorID === this.state.userID)
            return (
                
                <div className="my_message_container">
                    {this.renderCreatorInfo()}
                    <div className="my_message_content_container">
                        <p>{this.state.content}</p>
                        {this.renderImage()}
                    </div>
                    <p style={{fontSize: "12px", color:'#aaadb1',lineHeight:'4px'}}>{this.state.creationDate >=1 ? this.state.creationDate + "h ago": (this.state.creationDate < 1) ? "few minutes" :this.state.creationDate + " min ago"} </p>
                </div>
                
                
            )
        else if(this.state.creatorID !== this.state.userID)
            return (
                <div className="subject_message_container">
                    {this.renderCreatorInfo()}
                    <div className="subject_message_box_container" >
                        <p >{this.state.content}</p>
                        {this.renderImage()}
                    </div>
                    <p style={{fontSize: "12px", color:'#aaadb1',lineHeight:'4px'}}>{this.state.creationDate >=1 ? this.state.creationDate + "h ago": (this.state.creationDate < 1 )? "few minutes" :this.state.creationDate + " min ago"}</p>
                </div>
            )
    }   
}
export default MessageBoxComponent;