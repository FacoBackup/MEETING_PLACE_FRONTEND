import { Redirect } from "react-router-dom"
import axios from 'axios';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import "./UserCommunitiesStyle.css"
import React from 'react'
import "../../pages/social/SocialStyle.css"
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';

class UserCommunitiesComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            token: params.token,
            communities: [],
            date: new Date(),
            conversations: {},
            redirect: false,
            redirectCommunityID: ''
        }
      this.fetchData = this.fetchData.bind(this)
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

    async fetchData(){
        
        await axios({
            method: 'get',
            url: 'http://localhost:8080/api/communities/related',
            headers: {"Authorization": 'Bearer ' + this.state.token}
        }).then(res=>{
            this.setState({
                communities: res.data
            })
        })
        .catch(error => console.log(error))
    }

    async setRedirect(communityID){
        console.log("PARAMS => " + communityID)
    
        this.setState({
            redirect: true,
            redirectCommunityID:communityID
        },()=>{
            console.log("STATE => " + JSON.stringify(this.state.redirectCommunityID))    
        })
    }

    render(){
        if(this.state.redirect === false)
        return(
            <div>
            
                <div className="social_component_container" >
                    <div className="socail_info_container">
                    <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular, textAlign:'center'}}>Communities</p>
                    {this.state.communities.map((community)=> 
                        <div className="social_personas_container"> 
                            <Persona
                            {...{
                                imageUrl: (community.imageURL === null) ?  community.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                                text: community.name,
                                secondaryText: community.role
                            }}
                            size={PersonaSize.size48}
                            imageAlt="Conversation picture"
                            />
                            <DefaultButton text="Quit Community" disabled={true}/>
                            <PrimaryButton text="See Community" onClick={() => this.setRedirect(community.id)}/>
                        </div>
                    )}
                    </div>
                </div>
    
            </div>
        );
        else{
            
            return(
                <Redirect to={'/community/'+this.state.redirectCommunityID}/>
            )
            
        }
    }
}

export default UserCommunitiesComponent