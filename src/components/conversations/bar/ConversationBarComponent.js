import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "./../../../style/conversation/ConversationBarStyle.css";
import Badge from '@material-ui/core/Badge';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar'
import { getTheme } from '@fluentui/react';
import Host from '../../../Host'
import { MailRounded } from '@material-ui/icons';

class ConversationBarComponent extends Component{
    constructor(){
        super()
        this.state={
            cookies: new Cookies(),
            conversations: [],
            theme: getTheme(),
            searchInput:"",
            profiles:[],
            lastPage: null
        }
        this.handleChange = this.handleChange.bind(this)
    }
    async handleChange(event){
        
        this.setState({
            searchInput: event.target.value
        })
        if(this.state.searchInput !== '')
            await this.fetchSearch()
        else if (this.state.searchInput === '')
            await this.fetchConversations()
    }
    componentDidMount(){
        this.fetchConversations()
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

    async fetchConversations (){
    
        await axios({
            method: 'get',
            url: Host()+'api/conversation/all',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
        }).then(res=>{
            console.log("CONVERSATIONS -> " + JSON.stringify(res.data))
            this.setState({
                conversations: res.data
            })
        })
        .catch(error => {
            console.log(error);
        });
    
      
    }
    
    async fetchProfile(conversationID){
        try{
            await axios({
                method: 'patch',
                url: Host()+'api/get/simplified/user/profile',
                headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
                data: {
                    userID: conversationID
                }
            }).then(res=>{
                if(res.data !== {})
                    this.setState({
                        profiles: res.data
                    })
                
            })
            .catch(error => {
                console.log(error)
            });
        }catch(error){
            console.log(error)
        }
    }

    // async fetchNewMessages(conversationID){
    //     try{
    //         await axios({
    //             method: 'patch',
    //             url: Host()+'api/get/simplified/user/profile',
    //             headers: {"Authorization": 'Bearer ' + (new Cookies()).get("JWT")},
    //             data: {
    //                 userID: conversationID
    //             }
    //         }).then(res=>{
    //             if(res.data !== {})
    //                 this.setState({
    //                     profiles: res.data
    //                 })
                
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         });
    //     }catch(error){
    //         console.log(error)
    //     }
    // }

    // async fetchSearch (){    
    //     await axios({
    //         method: 'patch',
    //         url: Host()+'api/conversation/search',
    //         headers: {"Authorization": 'Bearer '+this.state.cookies.get("JWT")},
    //         data: {
    //             conversationID: this.state.searchInput
    //         }
    //     }).then(res=>{
    //         console.log(JSON.stringify(res.data))
    //         this.setState({
    //             conversations: res.data
    //         })
    //     })
    //     .catch(error => console.log(error));
    // }

    renderPersona(data, isGroup){
        switch(isGroup){
            case true:{

                return(
                    <div className="conversation_box_container " key={data.conversationID} >
                    
                    <Link className="conversation_box_content" key={data.conversationID} style={{textDecoration: 'none', color:'white'}} to ={"/chat/" + ((data.name).replace(this.state.cookies.get('ID'), "")) +"/"+JSON.stringify(isGroup) +"/"+data.id}>
                        
                        <Avatar src={data.imageURL}/>
                        <p style={{fontWeight:'500',margin:'auto', marginLeft:'1vw', textTransform:"capitalize"}}>{(""+data.name)}</p>
                        <Badge color="secondary" badgeContent={data.unreadMessages}>
                            <MailRounded/>
                        </Badge>
                    
                    </Link>
                </div>
                    )
            }
            case false:{
                
                return(
                    <div className="conversation_box_container " key={data.conversationID} >
                    
                        <Link className="conversation_box_content" key={data.conversationID} style={{textDecoration: 'none', color:'white'}} to ={"/chat/" + ((data.name).replace(this.state.cookies.get('ID'), "")) +"/"+JSON.stringify(isGroup) +"/"+data.id}>
                            
                            <Avatar src={data.imageURL}/>
                            <p style={{fontWeight:'500',margin:'auto', marginLeft:'1vw',textTransform:"capitalize" }}>{data.userName}</p>
                            <Badge color="secondary" badgeContent={data.unreadMessages}>
                                <MailRounded/>
                            </Badge>
                        
                        </Link>
                    </div>
                )
            }
            default:{
                return(
                    null
                )
            }
        }
    }
    render(){
        return(
            <div className="conversation_bar_component_container">
                <div className="conversation_title_container">
                    <p style={{marginLeft:'5px',fontSize:'17px',fontWeight:'400', textTransform:'capitalize'}}>Conversations</p>
                </div>
                <div className="conversation_personas">
                {this.state.conversations.map((chat) => 
                 
                   this.renderPersona(chat,chat.isGroup)
              
                )}
                    
                </div>
                {/* <div className="conversation_search">
                    <TextField placeholder="Search conversation" onChange={this.handleChange} disabled={true}/>
                </div> */}
                
            </div>
        );
    }
}   

export default ConversationBarComponent;