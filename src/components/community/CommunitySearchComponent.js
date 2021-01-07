import { Redirect } from "react-router-dom"
import axios from 'axios';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import "./UserCommunitiesStyle.css"
import React from 'react'
import "../../pages/social/SocialStyle.css"
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { TextField } from '@fluentui/react';

class CommunitySearchComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            token: params.token,
            communities: [],
            date: new Date(),
            conversations: {},
            redirect: false,
            redirectCommunityID: '',
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
        console.log("UPDATING")
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
                url: 'http://localhost:8080/api/search/community',
                headers: {"Authorization": 'Bearer ' + this.state.token},
                data:{
                    communityID: this.state.searchInput
                }
            }).then(res=>{
                console.log("RESPONSE -> " +JSON.stringify(res.data))
                this.setState({
                    communities: res.data
                })
            })
            .catch(error => console.log(error))
        }
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
                <div className="search_component">
                <div>
                  <p style={{ fontSize: FontSizes.size18, fontWeight:FontWeights.regular, textAlign:'center'}}>Search Community</p>
                </div>
                <div className="search_box_container">
                    <TextField placeholder="Search Community" onChange={this.handleChange}/>
                </div>
                
                    
                <div className="socail_info_container">
                
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
                            <DefaultButton text="Quit Community" disabled={(community.role === "")}/>
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

export default CommunitySearchComponent