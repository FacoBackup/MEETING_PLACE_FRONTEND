
import axios from 'axios';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import "../../../style/profile/UserCommunitiesStyle.css"
import React from 'react'
import "../../../style/profile/SocialStyle.css"
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import Host from '../../../Host'
import Cookies from 'universal-cookie';

class UserCommunitiesComponent extends React.Component{
    constructor(params){
        super(params)
        this.state={
            token: params.token,
            communities: [],
            date: new Date(),
            conversations: {},
            userID: params.userID
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
            method: 'patch',
            url: Host()+'api/get/all/user/communities',
            headers: {"Authorization": 'Bearer ' + this.state.token},
            data: {
                userID: this.state.userID
            }
        }).then(res=>{
            this.setState({
                communities: res.data
            })
        })
        .catch(error => console.log(error))
    }

    render(){
        return(
            <div >
                <p style={{fontSize:'20px',fontWeight:'500', textAlign:'center'}}>Communities</p>
                {(this.state.communities.length === 0 && this.state.userID === (new Cookies()).get("ID")) ? 
                    
                    <p style={{ fontSize: FontSizes.size16, fontWeight:FontWeights.regular, textAlign:'center'}}>Looks like you are not a member of any community, try searching by one.</p>
                    
                    :this.state.communities.map((community)=> 
                    <div className="personas_container"> 
                        <Persona
                        {...{
                            imageUrl: (community.imageURL !== null) ?  community.imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNwMYAh1BP0Zhiy6r_gvjMMegcosFo70BUw&usqp=CAU",
                            text: community.name,
                            secondaryText: community.about,
                            tertiaryText: community.role
                        }}
                        size={PersonaSize.size72}
                        imageAlt="Conversation picture"
                        />
                        <DefaultButton text="Quit Community" disabled={true}/>
                        <PrimaryButton text="See Community" href={'/community/'+community.communityID}/>
                    </div>
                )}
            </div>      
        );
    }
}

export default UserCommunitiesComponent