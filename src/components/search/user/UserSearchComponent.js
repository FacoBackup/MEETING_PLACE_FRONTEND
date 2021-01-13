import { Redirect } from "react-router-dom"
import axios from 'axios';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import React from 'react'
import "../../../style/profile/SocialStyle.css"
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { TextField } from '@fluentui/react';
import "../../../style/profile/UserCommunitiesStyle.css"
import "../../../style/search/SearchComponentStyle.css"
import Host from '../../../Host'
import FollowUser from '../../../functions/social/FollowUser'
import UnfollowUser from '../../../functions/social/UnfollowUser'

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
                url: Host()+'api/search/user',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data:{
                    userID: this.state.searchInput
                }
            }).then(res=>{
                
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
            url: Host()+'api/conversation/by/owner',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data:{
                userID: param
            }
        }).then(res=>{
            
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
    async follow(userID){
        FollowUser(userID)
        this.fetchData()
    }
    async unfollow(userID){
        UnfollowUser(userID)
        this.fetchData()
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
                
                    
                <div>
                    {this.state.users.map((user)=> 
                        <div className="personas_container"> 
                            <Persona
                            {...{
                                imageUrl: user.imageURL,
                                text: user.name,
                                secondaryText: user.email,
                                tertiaryText: user.phoneNumber

                            }}
                            size={PersonaSize.size72}
                            imageAlt="Conversation picture"
                            />
                            <DefaultButton  text ="See Profile"  href={"/profile/"+user.email+'/0'}/>
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