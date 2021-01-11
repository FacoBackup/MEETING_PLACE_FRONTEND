
import axios from 'axios';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import "./UserCommunitiesStyle.css"
import React from 'react'
import "../social/SocialStyle.css"
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { TextField } from '@fluentui/react';
import Host from '../../Host'
import FollowCommunity from './FollowCommunity'

class CommunitySearchComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            token: params.token,
            isModal: params.isModal,
            communities: [],
            date: new Date(),
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
  
       if(this.state.searchInput !== ''){
            await axios({
                method: 'patch',
                url: Host()+'api/search/community',
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
    
    selectCommunity(community){
        sessionStorage.setItem("SELECTED_COMMUNITY",JSON.stringify(community))
    }
    renderButtons(community){
        console.log("COMMUNITY FOUND -> " + JSON.stringify(community))
        if(this.state.isModal === false)
            return(
                <div>
                    {(community.role === "") ? <PrimaryButton text="Follow Community" onClick={()=>FollowCommunity(community.communityID)}/> : <DefaultButton text="Quit Community"/>}
                    <DefaultButton text="See Community" href={'/community/' + community.communityID}/>
                </div>
            )
        else
            return(
                <div>
                    <PrimaryButton text="Select" onClick={() => this.selectCommunity(community)}/>
                </div>
            )
    }
    render(){
        
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
                        <div className="personas_container"> 
                            <Persona
                            {...{
                                imageUrl: (community.imageURL === null) ?  community.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                                text: community.name,
                                secondaryText: community.role,
                                tertiaryText: community.about
                            }}
                            size={PersonaSize.size72}
                            imageAlt="Conversation picture"
                            />
                            {this.renderButtons(community)}
                           
                        </div>
                    )}
                    </div>   
                </div>
                
            </div>
    
            
        );
     
    }
}

export default CommunitySearchComponent