import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'; 
import "../../../style/PageModel.css"
import "../SocialStyle.css"
import { getTheme } from '@fluentui/react';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { PrimaryButton,DefaultButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import {  Redirect } from 'react-router-dom';
import Host from '../../../Host'

class Following extends React.Component{
    constructor(params){
        super()
        this.state={
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
    componentDidMount(){
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
            url: Host()+'api/get/following',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
            data:{
                userID: this.state.userID
            }
        }).then(res=>{
            this.setState({
                following: res.data
            })
        })
        .catch(error => {
            console.log(error);
        });
    }

    async fetchConversation (param){
        await axios({
            method: 'patch',
            url: Host()+'api/conversation/by/owner',
            headers: {"Authorization": 'Bearer ' + this.state.cookies.get("JWT")},
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

    render(){
        if(this.state.redirect === false)
            return(
                <div>
        
                    <div className="social_component_container">
                        <div >
                        <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular, textAlign:'center'}}>Following</p>
                        {(this.state.following.length === 0) ? 
                        <div>
                            <p style={{textAlign:'center', fontSize: FontSizes.size16, fontWeight:FontWeights.regular}}>Looks don't follow anyone yet, try searching for a friend.</p>
                        </div>
                        :this.state.following.map((flw)=> 
                            <div className="personas_container"> 
                                <Persona
                                {...{
                                    imageUrl: (flw.imageURL === null) ?  flw.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                                    text: flw.name,
                                    secondaryText: flw.email,
                                    tertiaryText: flw.phoneNumber
                                }}
                                size={PersonaSize.size72}
                                imageAlt="Conversation picture"
                                />
                                <DefaultButton text ="See Profile"  href={"/profile/"+flw.email+'/0'}/>
                                <PrimaryButton onClick={() => this.setRedirect(flw.email)} text="Send Message"/>
                            </div>
                        )}
                        </div>
                    </div>
        
                </div>
            );
            else{
            
                return(
                    <Redirect to={'/chat/'+this.state.redirectUserID+"/false/"+(typeof this.state.conversations.conversationID === 'undefined'? this.state.redirectUserID: this.state.conversations.conversationID)}/>
                )
                
            }
        }
    
}


export default Following;