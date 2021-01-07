import { Redirect } from "react-router-dom"
import axios from 'axios';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import React from 'react'
import "../../../pages/social/SocialStyle.css"
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { TextField } from '@fluentui/react';
import "../../community/UserCommunitiesStyle.css"
import "./SearchComponentStyle.css"

class UserSearchComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            token: params.token,
            users: [],
            date: new Date(),
            conversations: {},
            redirect: false,
            redirectUserID: '',
            searchInput: ''
        }
      this.fetchData = this.fetchData.bind(this)
      this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount(){

        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        
        this.fetchData();
        this.setState({
            date: new Date(),
        });
    }
    handleChange(event){
        
        this.setState({
            searchInput: event.target.value
        })
        this.fetchData()
    }
    async fetchData(){
        console.log("INPUT -> " + this.state.searchInput)
        console.log("token -> " + this.state.token)
       if(this.state.searchInput !== ''){
            await axios({
                method: 'patch',
                url: 'http://localhost:8080/api/search/user',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data:{
                    userID: this.state.searchInput
                }
            }).then(res=>{
                console.log("RESPONSE -> " +JSON.stringify(res.data))
                this.setState({
                    users: res.data
                })
            })
            .catch(error => console.log(error))
        }
    }
    async fetchConversation (param){
        await axios({
            method: 'patch',
            url: 'http://localhost:8080/api/conversation/by/owner',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data:{
                userID: param
            }
        }).then(res=>{
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
    async setRedirect(userID){
        console.log("PARAMS => " + userID)
        await this.fetchConversation(userID)
        this.setState({
            redirect: true,
            redirectUserID:userID
        },()=>{
            console.log("STATE => " + JSON.stringify(this.state.redirectUserID))    
        })
    }
    async follow (params){

        await axios({
            method: 'post',
            url: 'http://localhost:8080/api/follow',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data: {
                subjectID: params,
                community: false
            }
        }).then(()=>{
            this.fetchData()
        })
        .catch();
    }

    async unfollow (params) {
        await axios({
            method: 'delete',
            url: 'http://localhost:8080/api/unfollow',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data: {
                subjectID: params,
                community: false
            }
        }).then(()=>{
            this.fetchData()
        })
        .catch();
    }

    render(){
        if(this.state.redirect === false)
        return(
            <div>
                <div className="search_component">
                <div>
                  <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular, textAlign:'center'}}>Search User</p>
                </div>
                <div className="search_box_container">
                    <TextField placeholder="Search Community" onChange={this.handleChange}/>
                </div>
                
                    
                <div className="socail_info_container">
                
                    {this.state.users.map((user)=> 
                        <div className="social_personas_container"> 
                            <Persona
                            {...{
                                imageUrl: (user.imageURL === null) ?  user.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                                text: user.name,
                                secondaryText: user.email
                            }}
                            size={PersonaSize.size48}
                            imageAlt="Conversation picture"
                            />
        
                            <PrimaryButton onClick={() => this.setRedirect(user.email)} text="Send Message"/>
                            {user.isFollowing ? <DefaultButton onClick={() => this.unfollow(user.email)} text="Unfollow"/>: <PrimaryButton onClick={() => this.follow(user.email)} text="Follow"/>}
                        </div>
                    )}
                    </div>   
                </div>
                
            </div>
    
            
        );
        else{
            console.log("CONVERSATION ID -> "+this.state.conversations.conversationID)
            return(
                <Redirect to={'/chat/'+this.state.redirectUserID+"/false/"+(typeof this.state.conversations.conversationID === 'undefined'? this.state.redirectUserID: this.state.conversations.conversationID)}/>
            )
            
        }
    }
}

export default UserSearchComponent